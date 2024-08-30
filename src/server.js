import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import moment from 'moment';

// Creare l'applicazione Express
const app = express();
app.use(cors());
app.use(express.json());

// Configurazione della connessione al database
const dbConfig = {
  host: 'localhost',
  user: 'root',  // Sostituisci con il tuo nome utente del database
  password: '',  // Sostituisci con la tua password del database
  database: 'biblio' // Sostituisci con il nome del tuo database
};

// Creare la connessione al database
const connection = mysql.createConnection(dbConfig);

// Connettersi al database
connection.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connesso al database MySQL.');
});

// Endpoint per ottenere i libri
app.get('/api/libri', (req, res) => {
  const idUtente = req.query.idUtente;

  const sqlLibri = 'SELECT * FROM libro';
  const sqlPrenotazioni = 'SELECT idLibro FROM prenotazione WHERE idUtente = ?';

  connection.query(sqlLibri, (error, resultsLibri) => {
    if (error) {
      return res.status(500).json({ error: 'Errore nel recupero dei libri.' });
    }

    connection.query(sqlPrenotazioni, [idUtente], (error, resultsPrenotazioni) => {
      if (error) {
        return res.status(500).json({ error: 'Errore nel recupero delle prenotazioni.' });
      }

      const libriPrenotati = resultsPrenotazioni.map(p => p.idLibro);

      const libri = resultsLibri.map(libro => {
        return {
          ...libro,
          isPrenotato: libriPrenotati.includes(libro.idLibro)
        };
      });

      res.json(libri);
    });
  });
});

app.get('/api/libri/:id', (req, res) => {
  const id = req.params.id;

  const query = 'SELECT * FROM libro WHERE idLibro = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Errore durante la query:', error);
          res.status(500).json({ error: 'Errore nella query al database.' });
          return;
      }

      if (results.length === 0) {
          res.status(404).json({ message: 'Libro non trovato' });
      } else {
          res.json(results[0]);
      }
  });
});

app.put('/api/libri/:id', (req, res) => {
  const id = req.params.id;
  const { Titolo, Autore, numCopie, trama, immagine } = req.body;

  const query = `
    UPDATE libro
    SET Titolo = COALESCE(?, Titolo),
        Autore = COALESCE(?, Autore),
        numCopie = COALESCE(?, numCopie),
        trama = COALESCE(?, trama),
        immagine = COALESCE(?, immagine)
    WHERE idLibro = ?
  `;

  connection.query(query, [Titolo, Autore, numCopie, trama, immagine, id], (error, results) => {
    if (error) {
      console.error('Errore durante l\'aggiornamento del libro:', error);
      res.status(500).json({ error: 'Errore durante l\'aggiornamento del libro' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Libro non trovato' });
    } else {
      res.json({ message: 'Libro aggiornato con successo' });
    }
  });
});

// Endpoint per cancellare un libro e le sue prenotazioni
app.delete('/api/libri/:id', (req, res) => {
  const id = req.params.id;

  // Query per eliminare le prenotazioni associate al libro
  const sqlDeletePrenotazioni = 'DELETE FROM prenotazione WHERE idLibro = ?';
  // Query per eliminare le code associate al libro
  const sqlDeleteCode = 'DELETE FROM coda WHERE idLibro = ?';
  // Query per eliminare il libro
  const sqlDeleteLibro = 'DELETE FROM libro WHERE idLibro = ?';

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante l\'avvio della transazione.' });
    }

    // Prima elimina le prenotazioni associate
    connection.query(sqlDeleteCode, [id], (error) => {
      if (error) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Errore durante la cancellazione delle code.' });
        });
      }

      // Poi elimina le code associate
      connection.query(sqlDeletePrenotazioni, [id], (error) => {
        if (error) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Errore durante la cancellazione delle prenotazioni.' });
          });
        }

        // Infine elimina il libro
        connection.query(sqlDeleteLibro, [id], (error) => {
          if (error) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Errore durante la cancellazione del libro.' });
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Errore durante la commit della transazione.' });
              });
            }

            res.json({ message: 'Libro, prenotazioni e code cancellati con successo.' });
          });
        });
      });
    });
  });
});


// Endpoint per prenotare un libro
app.patch('/api/libri/prenota/:id', (req, res) => {
  const sqlUpdateLibro = 'UPDATE libro SET numCopie = numCopie - 1 WHERE idLibro = ? AND numCopie > 0';
  const sqlInsertPrenotazione = 'INSERT INTO prenotazione (idLibro, idUtente, inizioPren, finePren) VALUES (?, ?, ?, ?)';
  const sqlAddToQueue = 'INSERT INTO coda (idLibro, idUtente, dataInserimento) VALUES (?, ?, ?)';
  const idLibro = req.params.id;
  const idUtente = req.body.idUtente;
  const inizioPrenotazione = moment().format('YYYY-MM-DD');
  const finePrenotazione = moment().add(30, 'days').format('YYYY-MM-DD');
  const dataInserimento = moment().format('YYYY-MM-DD HH:mm:ss');

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante l\'avvio della transazione.' });
    }

    connection.query(sqlUpdateLibro, [idLibro], (error, results) => {
      if (error) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Errore durante l\'aggiornamento del libro.' });
        });
      }

      if (results.affectedRows === 0) {
        // Se non ci sono copie disponibili, aggiungi alla coda
        connection.query(sqlAddToQueue, [idLibro, idUtente, dataInserimento], (error) => {
          if (error) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Errore durante l\'inserimento nella coda.' });
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Errore durante la commit della transazione.' });
              });
            }

            res.json({ message: 'Libro aggiunto alla coda con successo.' });
          });
        });
      } else {
        // Se ci sono copie disponibili, prenota il libro
        connection.query(sqlInsertPrenotazione, [idLibro, idUtente, inizioPrenotazione, finePrenotazione], (error) => {
          if (error) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Errore durante l\'inserimento della prenotazione.' });
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Errore durante la commit della transazione.' });
              });
            }

            res.json({ message: 'Libro prenotato con successo.' });
          });
        });
      }
    });
  });
});

// Endpoint per restituire un libro
app.patch('/api/libri/restituisci/:id', (req, res) => {
  const { idUtente } = req.body;
  const idLibro = req.params.id;

  const sqlCheckPrenotazione = 'SELECT * FROM prenotazione WHERE idLibro = ? AND idUtente = ?';
  const sqlDeletePrenotazione = 'DELETE FROM prenotazione WHERE idLibro = ? AND idUtente = ?';
  const sqlUpdateLibro = 'UPDATE libro SET numCopie = numCopie + 1 WHERE idLibro = ?';
  const sqlGetQueue = 'SELECT idUtente FROM coda WHERE idLibro = ? ORDER BY dataInserimento LIMIT 1';
  const sqlAssignToQueue = 'INSERT INTO prenotazione (idLibro, idUtente, inizioPren, finePren) VALUES (?, ?, ?, ?)';
  const sqlDeleteQueue = 'DELETE FROM coda WHERE idLibro = ? AND idUtente = ?';

  connection.query(sqlCheckPrenotazione, [idLibro, idUtente], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Errore nella query al database.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Nessuna prenotazione trovata per questo libro e utente.' });
    }

    connection.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: 'Errore durante l\'avvio della transazione.' });
      }

      connection.query(sqlDeletePrenotazione, [idLibro, idUtente], (error) => {
        if (error) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Errore durante la cancellazione della prenotazione.' });
          });
        }

        connection.query(sqlGetQueue, [idLibro], (error, results) => {
          if (error) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Errore durante la query della coda.' });
            });
          }

          if (results.length > 0) {
            const nextInQueue = results[0].idUtente;
            const inizioPrenotazione = moment().format('YYYY-MM-DD');
            const finePrenotazione = moment().add(30, 'days').format('YYYY-MM-DD');

            connection.query(sqlAssignToQueue, [idLibro, nextInQueue, inizioPrenotazione, finePrenotazione], (error) => {
              if (error) {
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Errore durante l\'assegnazione del libro dalla coda.' });
                });
              }

              connection.query(sqlDeleteQueue, [idLibro, nextInQueue], (error) => {
                if (error) {
                  return connection.rollback(() => {
                    res.status(500).json({ error: 'Errore durante la cancellazione dalla coda.' });
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      res.status(500).json({ error: 'Errore durante la commit della transazione.' });
                    });
                  }

                  res.json({ message: 'Libro restituito e assegnato al prossimo utente in coda.' });
                });
              });
            });
          } else {
            // Nessun utente in coda, incrementa il numero delle copie disponibili
            connection.query(sqlUpdateLibro, [idLibro], (error) => {
              if (error) {
                return connection.rollback(() => {
                  res.status(500).json({ error: 'Errore durante l\'aggiornamento del libro.' });
                });
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res.status(500).json({ error: 'Errore durante la commit della transazione.' });
                  });
                }

                res.json({ message: 'Libro restituito con successo.' });
              });
            });
          }
        });
      });
    });
  });
});

app.post('/api/libri/aggiungi', (req, res) => {
    const { titoloCard, autoreCard, copieCard, descrizione, imgurl } = req.body;

    const query = `
        INSERT INTO libro (Titolo, Autore, numCopie, trama, immagine) 
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [titoloCard, autoreCard, copieCard, descrizione, imgurl];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Errore durante l\'inserimento nel database:', error);
            res.status(500).json({ error: 'Errore nella query al database.' });
            return;
        }

        res.status(201).json({ message: 'Libro aggiunto con successo!', id: results.insertId });
    });
});

// Endpoint per il login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM utente WHERE username = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error('Errore durante la query:', error);
        res.status(500).json({ error: 'Errore nella query al database.' });
        return;
      }
  
      if (results.length > 0) {
        const user = results[0];
  
        // Controlla se la password corrisponde
        if (user.password === password) {
          // Rimuovi la password dall'oggetto user prima di inviarlo al client
          delete user.password;

          res.status(200).json({ 
            success: true, 
            message: 'Login avvenuto con successo!', 
            user // Invia i dati dell'utente al client
          });
        } else {
          res.status(401).json({ success: false, message: 'Credenziali non valide' });
        }
      } else {
        res.status(401).json({ success: false, message: 'Credenziali non valide' });
      }
    });
  });

  app.post('/api/utenti/registrazione', (req, res) => {
    const { email, password } = req.body;

    const query = `
        INSERT INTO utente (username, password)
        VALUES (?, ?)
    `;

    const values = [email, password];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Errore durante l\'inserimento nel database:', error);
            res.status(500).json({ success: false, error: 'Errore nella query al database.' });
            return;
        }

        res.status(201).json({ success: true, message: 'Utente registrato con successo!', id: results.insertId });
    });
});
  
// Endpoint per ricevere tutte le prenotazioni
app.get('/api/prenotazioni', (req, res) => {
  // Ottieni l'ID utente dalla query string
  const userId = req.query.userId;

  // Costruisci la query SQL con join per ottenere username e titolo del libro
  let sql = `
    SELECT
      prenotazione.idLibro,
      libro.Titolo,
      prenotazione.idUtente,
      utente.username AS username,
      prenotazione.inizioPren,
      prenotazione.finePren
    FROM prenotazione
    JOIN libro ON prenotazione.idLibro = libro.idLibro
    JOIN utente ON prenotazione.idUtente = utente.idUtente
  `;

  // Aggiungi il filtro per l'ID utente se è presente
  if (userId) {
    sql += ' WHERE prenotazione.idUtente = ?';
  }

  connection.query(sql, userId ? [userId] : [], (error, results) => {
    if (error) {
      console.error('Errore durante il recupero delle prenotazioni:', error);
      return res.status(500).json({ error: 'Errore nel recupero delle prenotazioni.' });
    }

    res.json(results);
  });
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

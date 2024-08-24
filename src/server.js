import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

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
  const query = 'SELECT idLibro, Titolo, numCopie, trama, immagine FROM libro';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Errore durante la query al database:', error);
      res.status(500).json({ error: 'Errore nella query al database.' });
      return;
    }

    // Invia la risposta JSON
    res.json(results);
  });
});

// Endpoint per cancellare un libro
app.delete('/api/libri/:id', (req, res) => {
    const sql = 'DELETE FROM libro WHERE idLibro = ?';
    const id = req.params.id;

    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Errore nella query al database.' });
        }
        res.json({ message: 'Libro cancellato con successo.' });
    });
});

// Endpoint per prenotare un libro
app.patch('/api/libri/prenota/:id', (req, res) => {
    const sql = 'UPDATE libro SET numCopie = numCopie - 1 WHERE idLibro = ? AND numCopie > 0';
    const id = req.params.id;

    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Errore nella query al database.' });
        }
        if (results.affectedRows === 0) {
            return res.status(400).json({ error: 'Non ci sono copie disponibili.' });
        }
        res.json({ message: 'Libro prenotato con successo.' });
    });
});

// Endpoint per restituire un libro
app.patch('/api/libri/restituisci/:id', (req, res) => {
    const sql = 'UPDATE libro SET numCopie = numCopie + 1 WHERE idLibro = ?';
    const id = req.params.id;

    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Errore nella query al database.' });
        }
        res.json({ message: 'Libro restituito con successo.' });
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
  

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

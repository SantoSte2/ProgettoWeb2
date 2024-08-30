import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'biblio'
});

connection.connect(error => {
  if (error) {
    console.error('Errore di connessione al database:', error);
  } else {
    console.log('Connesso al database MySQL.');
  }
});


// Routes
app.get('/api/records', (req, res) => {
  const sql = 'SELECT * FROM libro';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).json({ error: 'Errore nella query al database.' });
    } else {
      res.json(results);
    }
  });
});

//app.post('/prenotaCard', (req, res) => {
  // const { id } = req.body;
  // const sql = 'UPDATE libro SET idCard = ? WHERE idLibro = ?';
  // connection.query(sql, [card, id], (error, results) => {
  //   if (error) {
  //     console.error('Errore nell\'aggiornamento:', error);
  //     res.status(500).json({ error: 'Errore nell\'aggiornamento dei dati.' });
  //   } else {
  //     res.json({ message: 'Record aggiornato con successo.' });
  //   }
  // });

  //res.json({ message: 'Record aggiornato con successo.' });

//});

app.post('/api/records', (req, res) => {
  const { title, copies } = req.body;
  const sql = 'INSERT INTO libro (Titolo, numCopie) VALUES (?, ?)';
  connection.query(sql, [title, copies], (error, results) => {
    if (error) {
      console.error('Errore nell\'inserimento:', error);
      res.status(500).json({ error: 'Errore nell\'inserimento dei dati.' });
    } else {
      res.status(201).json({ message: 'Record aggiunto con successo.', id: results.insertId });
    }
  });
});

app.delete('/api/records/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM libro WHERE idLibro = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Errore nella cancellazione:', error);
      res.status(500).json({ error: 'Errore nella cancellazione dei dati.' });
    } else {
      res.json({ message: 'Record cancellato con successo.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

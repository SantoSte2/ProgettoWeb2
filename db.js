const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'biblio'
});

connection.connect((err) => {
    if (err) {
        console.error('Errore di connessione al database: ' + err.stack);
        return;
    }
    console.log('Connesso al database come ID ' + connection.threadId);
});

module.exports = connection;
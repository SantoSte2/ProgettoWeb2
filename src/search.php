<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5173');
header('Content-Type: application/json');
// Connessione al database (sostituisci con i tuoi dati)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "biblio";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica la connessione
if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// Esecuzione della query (puoi personalizzarla in base alle tue esigenze)
$sql = "SELECT idLibro, Titolo, numCopie, trama, immagine FROM libro";
$result = $conn->query($sql);

// Creazione dell'array dei risultati
$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo "0 risultati";
}

// Chiusura della connessione
$conn->close();

// Invio della risposta in formato JSON
header('Content-Type: application/json');
echo json_encode($data);
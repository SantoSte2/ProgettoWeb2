<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5173');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS'); // Aggiungi PATCH alla lista dei metodi consentiti
header('Access-Control-Allow-Headers: Content-Type'); // Permette l'intestazione Content-Type

// Connessione al database
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'biblio';

$conn = new mysqli($host, $user, $password, $database);

// Verifica la connessione
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connessione al database fallita']));
}

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Query per incrementare il numero di copie
    $sql = "UPDATE libro SET numCopie = numCopie + 1 WHERE idLibro = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Libro restituito con successo']);
    } else {
        echo json_encode(['error' => 'Errore nella restituzione del libro']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'ID del libro non fornito']);
}

$conn->close();
?>

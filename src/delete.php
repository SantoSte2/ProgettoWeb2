<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5173');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS, PATCH'); // Permette i metodi HTTP
header('Access-Control-Allow-Headers: Content-Type'); // Permette l'intestazione Content-Type

// Connessione al database
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'biblio'; // Sostituisci con il nome del tuo database

$conn = new mysqli($host, $user, $password, $database);

// Verifica la connessione
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connessione al database fallita']));
}

// Controlla che l'ID sia stato passato come parametro
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Query di eliminazione
    $sql = "DELETE FROM libro WHERE idLibro = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Libro cancellato con successo']);
    } else {
        echo json_encode(['error' => 'Errore nella cancellazione del libro']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'ID del libro non fornito']);
}

$conn->close();
?>

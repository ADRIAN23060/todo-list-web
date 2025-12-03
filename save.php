<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Content-Type: application/json");

// Koneksi ke database
$host = 'localhost';
$user = 'root';           // Username default untuk XAMPP
$pass = '';               // Password default untuk XAMPP
$db_name = 'db_todos';    // Nama database

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET: Return all todos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM todos";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $todos = [];
        while ($row = $result->fetch_assoc()) {
            $todos[] = $row;
        }
        echo json_encode($todos);
    } else {
        echo json_encode(["status" => "error", "message" => "No todos found."]);
    }
    exit();
}

// POST: Save todos (replace all)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if ($data) {
        // Menghapus semua todo lama
        $conn->query("DELETE FROM todos");

        // Menyimpan todo baru
        foreach ($data as $todo) {
            $title = $conn->real_escape_string($todo['title']);
            $description = $conn->real_escape_string($todo['description']);
            $due_date = $conn->real_escape_string($todo['due_date']);
            $status = $conn->real_escape_string($todo['status']);

            $sql = "INSERT INTO todos (title, description, due_date, status) 
                    VALUES ('$title', '$description', '$due_date', '$status')";

            if (!$conn->query($sql)) {
                echo json_encode(["status" => "error", "message" => "Failed to insert todo"]);
                exit();
            }
        }
        echo json_encode(["status" => "success", "message" => "Todos saved successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
    }
    exit();
}

// DELETE: Delete a specific todo by id
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = file_get_contents("php://input");
    $decoded = json_decode($input, true);
    $deleteId = $decoded["id"] ?? null;

    if (!$deleteId) {
        echo json_encode(["status" => "error", "message" => "Missing todo ID"]);
        exit();
    }

    $sql = "DELETE FROM todos WHERE id = '$deleteId'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Todo deleted successfully", "deleted_id" => $deleteId]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete todo"]);
    }
    exit();
}

// Fallback: Method not allowed
echo json_encode(["status" => "error", "message" => "Unsupported request method"]);
$conn->close();
?>

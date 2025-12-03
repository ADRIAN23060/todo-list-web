<?php
include "db.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM todos ORDER BY id DESC");
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $task = $data["task"];

        $conn->query("INSERT INTO todos (task) VALUES ('$task')");
        echo json_encode(["message" => "Task Added"]);
        break;

    case 'DELETE':
        $id = $_GET["id"];
        $conn->query("DELETE FROM todos WHERE id=$id");
        echo json_encode(["message" => "Task Deleted"]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data["id"];
        $task = $data["task"];

        $conn->query("UPDATE todos SET task='$task' WHERE id=$id");
        echo json_encode(["message" => "Task Updated"]);
        break;
}
?>

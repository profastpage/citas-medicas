<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

if (!isset($_GET['clave']) || empty($_GET['clave'])) {
    echo json_encode(['error' => 'No clave provided']);
    exit;
}

try {
    $db = new PDO('mysql:host=localhost;dbname=licencias_db;charset=utf8mb4', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare("SELECT estado FROM licencias WHERE clave_licencia = :clave LIMIT 1");
    $stmt->execute([':clave' => trim($_GET['clave'])]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(['estado' => $result['estado']]);
    } else {
        echo json_encode(['error' => 'Licencia no encontrada']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error']);
}

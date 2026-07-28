<?php
require_once __DIR__ . '/app/config/Database.php';
$db = (new Database())->connect();
$stmt = $db->query("SHOW TABLES");
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
$stmt = $db->query("SHOW COLUMNS FROM usuarios");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

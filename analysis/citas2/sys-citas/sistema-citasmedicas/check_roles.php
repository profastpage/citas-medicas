<?php
require_once __DIR__ . '/app/config/Database.php';
$db = (new Database())->connect();
$stmt = $db->query("SELECT * FROM roles");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

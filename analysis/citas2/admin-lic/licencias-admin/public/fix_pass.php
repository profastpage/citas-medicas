<?php
$pdo = new PDO('mysql:host=localhost;dbname=licencias_db;charset=utf8', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$email = 'admin@licencias.com';
$password = 'Sistemas2025';
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE admin_licencias SET password = ? WHERE email = ?");
$stmt->execute([$hash, $email]);

echo "Admin password has been reset successfully to: " . $password;

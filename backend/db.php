<?php
$host = 'localhost';
$db   = 'nsbjj_db';
$user = 'root';
$pass = ''; // Default XAMPP password is empty
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERR_MODE            => PDO::ERR_MODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // If database doesn't exist, we'll try to create it or report error
     if ($e->getCode() == 1049) {
         try {
             $pdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
             $pdo->exec("CREATE DATABASE `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
             $pdo->exec("USE `$db` text");
         } catch (\PDOException $e2) {
             die("Database connection failed: " . $e2->getMessage());
         }
     } else {
         die("Database connection failed: " . $e->getMessage());
     }
}

// Create tables if they don't exist
$pdo->exec("CREATE TABLE IF NOT EXISTS instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bjj_rank VARCHAR(100),
    achievements TEXT,
    instagram_handle VARCHAR(255),
    profile_picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Insert default admin if not exists (username: admin, password: password123)
// In production, this should be handled more securely
$stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = 'admin'");
$stmt->execute();
if ($stmt->fetchColumn() == 0) {
    $hash = password_hash('password123', PASSWORD_DEFAULT);
    $pdo->prepare("INSERT INTO admins (username, password) VALUES ('admin', ?)")->execute([$hash]);
}
?>

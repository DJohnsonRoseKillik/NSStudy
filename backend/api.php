<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'OPTIONS') {
    exit;
}

$path = isset($_GET['path']) ? $_GET['path'] : '';

switch ($path) {
    case 'instructors':
        if ($method == 'GET') {
            $stmt = $pdo->query("SELECT * FROM instructors ORDER BY id ASC");
            echo json_encode($stmt->fetchAll());
        } elseif ($method == 'POST') {
            // Handle Add Instructor (Admin only in production)
            $name = $_POST['name'] ?? '';
            $title = $_POST['title'] ?? '';
            $bjj_rank = $_POST['bjj_rank'] ?? '';
            $achievements = $_POST['achievements'] ?? '';
            $instagram_handle = $_POST['instagram_handle'] ?? '';
            
            $profile_picture_url = '';
            if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                $target_dir = "../uploads/";
                if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                $file_name = time() . '_' . basename($_FILES["image"]["name"]);
                $target_file = $target_dir . $file_name;
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                    $profile_picture_url = "uploads/" . $file_name;
                }
            }

            $sql = "INSERT INTO instructors (name, title, bjj_rank, achievements, instagram_handle, profile_picture_url) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $title, $bjj_rank, $achievements, $instagram_handle, $profile_picture_url]);
            echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
        }
        break;

    case 'instructor':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(['error' => 'ID required']);
            exit;
        }

        if ($method == 'GET') {
            $stmt = $pdo->prepare("SELECT * FROM instructors WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode($stmt->fetch());
        } elseif ($method == 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM instructors WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
        } elseif ($method == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
            // PHP doesn't handle multipart/form-data with PUT easily, using POST with _method spoofing
            $name = $_POST['name'] ?? '';
            $title = $_POST['title'] ?? '';
            $bjj_rank = $_POST['bjj_rank'] ?? '';
            $achievements = $_POST['achievements'] ?? '';
            $instagram_handle = $_POST['instagram_handle'] ?? '';
            
            $sql = "UPDATE instructors SET name=?, title=?, bjj_rank=?, achievements=?, instagram_handle=? WHERE id=?";
            $params = [$name, $title, $bjj_rank, $achievements, $instagram_handle, $id];

            if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                $target_dir = "../uploads/";
                if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                $file_name = time() . '_' . basename($_FILES["image"]["name"]);
                $target_file = $target_dir . $file_name;
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                    $profile_picture_url = "uploads/" . $file_name;
                    $sql = "UPDATE instructors SET name=?, title=?, bjj_rank=?, achievements=?, instagram_handle=?, profile_picture_url=? WHERE id=?";
                    $params = [$name, $title, $bjj_rank, $achievements, $instagram_handle, $profile_picture_url, $id];
                }
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo json_encode(['status' => 'success']);
        }
        break;

    case 'login':
        if ($method == 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';

            $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
            $stmt->execute([$username]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password'])) {
                // In production, use JWT or proper sessions
                echo json_encode(['status' => 'success', 'token' => 'dummy-token']);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid endpoint']);
        break;
}
?>

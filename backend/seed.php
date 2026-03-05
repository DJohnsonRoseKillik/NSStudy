<?php
require_once 'db.php';

$instructors = [
    ['name' => 'Reiss Bailey', 'title' => 'Head Instructor', 'bjj_rank' => 'Black Belt', 'achievements' => 'World Champion', 'instagram_handle' => 'reissbailey_'],
    ['name' => 'Kaira Manders', 'title' => 'Instructor', 'bjj_rank' => 'Blue Belt', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Hejraat Rashid', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'James Bryan', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Bernardo Rosalba', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Josh', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Olly Jones', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Tyler Jackson Dawkins', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Leonardo Neves', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Onyeka Nwogwonuwe', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => ''],
    ['name' => 'Junior', 'title' => 'Instructor', 'bjj_rank' => '', 'achievements' => '', 'instagram_handle' => '']
];

foreach ($instructors as $instructor) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM instructors WHERE name = ?");
    $stmt->execute([$instructor['name']]);
    if ($stmt->fetchColumn() == 0) {
        $sql = "INSERT INTO instructors (name, title, bjj_rank, achievements, instagram_handle) VALUES (?, ?, ?, ?, ?)";
        $pdo->prepare($sql)->execute([
            $instructor['name'],
            $instructor['title'],
            $instructor['bjj_rank'],
            $instructor['achievements'],
            $instructor['instagram_handle']
        ]);
    }
}

echo "Seeding complete!";
?>

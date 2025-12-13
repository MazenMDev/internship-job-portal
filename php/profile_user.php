<?php
include 'db_connection.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }

    $user_id   = intval($_SESSION['user_id']);
    $firstName = isset($_POST['fname']) ? $_POST['fname'] : '';
    $lastName  = isset($_POST['lname']) ? $_POST['lname'] : '';
    $headline  = isset($_POST['headline']) ? $_POST['headline'] : '';
    $bio       = isset($_POST['bio']) ? $_POST['bio'] : '';

    // update all four columns
    $stmt = $conn->prepare(
        "UPDATE users 
         SET First_Name = ?, Last_Name = ?, Title = ?, Bio = ?
         WHERE Id = ?"
    );
    $stmt->bind_param("ssssi", $firstName, $lastName, $headline, $bio, $user_id);
    $stmt->execute();

    // return updated row
    $stmt = $conn->prepare(
        "SELECT Id, Image, First_Name, Last_Name, Email, Bio, Title, Major
         FROM users
         WHERE Id = ?"
    );
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "User not found"]);
    }

    exit;
}



if (isset($_GET['id'])) {
    $user_id = intval($_GET['id']);

    $session_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;

    $stmt = $conn->prepare("SELECT Id, Image, cv, First_Name, Last_Name, Email, Bio, Title, Major FROM users WHERE Id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $row['Id'] = intval($row['Id']);
        $row['is_owner'] = $session_id !== null && $session_id === $row['Id'];

        $getCourses = $conn->prepare(
            "SELECT id, title , institution , start_date, end_date , description FROM courses WHERE user_id = ?" );
        $getCourses->bind_param("i", $user_id);
        $getCourses->execute();
        $coursesResult = $getCourses->get_result();
        $courses = [];
        while ($course = $coursesResult->fetch_assoc()) {
            $course['id'] = intval($course['id']);
            $courses[] = $course;
        }
        $row['courses'] = $courses;

        $getEducation = $conn->prepare(
            "SELECT id , title , institution, start_date , end_date , description FROM education WHERE user_id = ?" );
        $getEducation->bind_param("i", $user_id);
        $getEducation->execute();
        $educationResult = $getEducation->get_result();
        $education = [];
        while ($edu = $educationResult->fetch_assoc()) {
            $edu['id'] = intval($edu['id']);
            $education[] = $edu;
        }
        $row['education'] = $education;

        $getExperience = $conn->prepare(
            "SELECT id , title , institution, start_date , end_date , description FROM experience WHERE user_id = ?" );
        $getExperience->bind_param("i", $user_id);
        $getExperience->execute();
        $experienceResult = $getExperience->get_result();
        $experience = [];
        while ($exp = $experienceResult->fetch_assoc()) {
            $exp['id'] = intval($exp['id']);
            $experience[] = $exp;
        }   
        $row['experience'] = $experience;

        $getProjects = $conn->prepare(
            "SELECT id , title , link, description FROM projects WHERE user_id = ?" );
        $getProjects->bind_param("i", $user_id);
        $getProjects->execute();
        $projectsResult = $getProjects->get_result();
        $projects = [];
        while ($proj = $projectsResult->fetch_assoc()) {
            $proj['id'] = intval($proj['id']);
            $projects[] = $proj;
        }
        $row['projects'] = $projects;

        $getSkills = $conn->prepare(
            "SELECT id , skill , info FROM skills WHERE user_id = ?" );
        $getSkills->bind_param("i", $user_id);
        $getSkills->execute();
        $skillsResult = $getSkills->get_result();
        $skills = [];
        while ($skill = $skillsResult->fetch_assoc()) {
            $skill['id'] = intval($skill['id']);
            $skills[] = $skill;
        }
        $row['skills'] = $skills;
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "User not found"]);
    }
} else {
    echo json_encode(["error" => "No ID provided"]);
}
?>
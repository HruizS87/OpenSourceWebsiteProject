<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connect.php'; // Include your database connection script

header('Content-Type: application/json'); // Set response content type to JSON

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Initialize variables to prevent undefined array key errors
    $first_name = isset($_POST['first_name']) ? mysqli_real_escape_string($conn, $_POST['first_name']) : '';
    $last_name = isset($_POST['last_name']) ? mysqli_real_escape_string($conn, $_POST['last_name']) : '';
    $address = isset($_POST['address']) ? mysqli_real_escape_string($conn, $_POST['address']) : '';
    $city = isset($_POST['city']) ? mysqli_real_escape_string($conn, $_POST['city']) : '';
    $state = isset($_POST['state']) ? mysqli_real_escape_string($conn, $_POST['state']) : '';
    $zip_code = isset($_POST['zip_code']) ? mysqli_real_escape_string($conn, $_POST['zip_code']) : '';
    $country = isset($_POST['country']) ? mysqli_real_escape_string($conn, $_POST['country']) : '';
    $email = isset($_POST['email']) ? mysqli_real_escape_string($conn, $_POST['email']) : '';
    $phone_number = isset($_POST['phone']) ? mysqli_real_escape_string($conn, $_POST['phone']) : '';

    // SQL query to insert client data
    $sql = "INSERT INTO clients (first_name, last_name, address, city, state, zip_code, country, email, phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $first_name, $last_name, $address, $city, $state, $zip_code, $country, $email, $phone_number);

    // Execute the query
    if ($stmt->execute()) {
        $client_id = $conn->insert_id;
        session_start();
        $_SESSION['client_id'] = $client_id;

        // Return a JSON response for successful operation
        echo json_encode(['status' => 'success', 'redirect' => 'payment.html']);
    } else {
        // Return a JSON response for error
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
    }

    $stmt->close(); // Close statement
    $conn->close(); // Close connection
} else {
    // Return a JSON response if the request method is not POST
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>

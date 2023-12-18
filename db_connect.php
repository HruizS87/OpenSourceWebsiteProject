<?php

$servername = "localhost";
$username = "HectorTechGear";
$password = "T3chEnteR!?";
$dbname = "TechGearHub";

// Create Connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check Connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Note: Removed the echo statement to prevent invalid JSON response

// No need to close the connection here, it will be closed after script execution
// $conn->close();
?>


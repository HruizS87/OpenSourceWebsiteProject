<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connect.php'; // Include your database connection script

// Start session to access session variables
session_start();

header('Content-Type: application/json'); // Set response content type to JSON

// Check if the form was submitted and if client_id is set in the session
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_SESSION['client_id'])) {
    // Simulate payment processing
    // In a real-world scenario, you would interface with a payment gateway here

    $client_id = $_SESSION['client_id']; // Retrieved from session
    // Ensure the cart is set and not empty
    if (isset($_POST['cart']) && !empty($_POST['cart'])) {
        $cartItems = json_decode($_POST['cart'], true); // Assuming cart data is sent via POST
        if (!$cartItems) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid cart data format']);
            exit;
        }
        
        // Calculate the total price taking into account the quantity
        $total_price = 0;
        foreach ($cartItems as $item) {
            $total_price += $item['price'] * $item['quantity'];
        }

        // Start transaction
        $conn->begin_transaction();

        try {
            // SQL query to insert order data
            $sql_order = "INSERT INTO orders (client_id, total_price) VALUES (?, ?)";
            $stmt_order = $conn->prepare($sql_order);
            $stmt_order->bind_param('id', $client_id, $total_price);
            $stmt_order->execute();
            $order_id = $conn->insert_id;

            // Process each cart item
            foreach ($cartItems as $item) {
                if (!isset($item['id'], $item['quantity'], $item['price'])) {
                    throw new Exception('Missing item details');
                }
                $inventory_id = $item['id']; // Assuming each item has an 'id' attribute
                $quantity = $item['quantity'];
                $price_at_time_of_purchase = $item['price'];

                // Insert order items
                $sql_order_item = "INSERT INTO order_items (order_id, inventory_id, quantity, price_at_time_of_purchase)
                                  VALUES (?, ?, ?, ?)";
                $stmt_order_item = $conn->prepare($sql_order_item);
                $stmt_order_item->bind_param('iiid', $order_id, $inventory_id, $quantity, $price_at_time_of_purchase);
                $stmt_order_item->execute();

                // Update inventory
                $sql_update_inventory = "UPDATE inventory SET quantity = quantity - ? WHERE id = ?";
                $stmt_update_inventory = $conn->prepare($sql_update_inventory);
                $stmt_update_inventory->bind_param('ii', $quantity, $inventory_id);
                $stmt_update_inventory->execute();
            }

            // Commit transaction
            $conn->commit();

            // Return success response with order ID
            echo json_encode(['status' => 'success', 'order_id' => $order_id]);

        } catch (Exception $e) {
            // An error occurred, roll back the transaction
            $conn->rollback();
            // Return error response
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Cart data not provided']);
    }

    // Close connection
    $conn->close();
} else {
    // If not a POST request or client_id is not set, return an error
    echo json_encode(['status' => 'error', 'message' => 'Invalid request or session expired']);
}
?>

<?php
include 'db_connect.php'; // Include your database connection script

// Function to fetch order details
function fetchOrderDetails($conn, $order_id) {
    // Prepare SQL to get order details
    $sql_order = "SELECT * FROM orders WHERE order_id = ?";
    $stmt_order = $conn->prepare($sql_order);
    $stmt_order->bind_param("i", $order_id);
    $stmt_order->execute();
    $result_order = $stmt_order->get_result();

    // Fetch the order details
    if ($order_details = $result_order->fetch_assoc()) {
        // Prepare SQL to get order items details
        $sql_items = "SELECT oi.*, inv.name, inv.price, inv.image_url
                      FROM order_items oi
                      JOIN inventory inv ON oi.inventory_id = inv.id
                      WHERE oi.order_id = ?";
        $stmt_items = $conn->prepare($sql_items);
        $stmt_items->bind_param("i", $order_id);
        $stmt_items->execute();
        $result_items = $stmt_items->get_result();
        $order_items = $result_items->fetch_all(MYSQLI_ASSOC);

        // Calculate the total price
        $total_price = 0;
        foreach ($order_items as $item) {
            $total_price += $item['price'] * $item['quantity'];
        }
        $order_details['total_price'] = $total_price;

        // Return order details and items as JSON
        return [
            'status' => 'success',
            'order' => $order_details,
            'items' => $order_items
        ];
    } else {
        return ['status' => 'error', 'message' => 'Order not found.'];
    }
}

// Determine the source of the order ID
$order_id = null;
if (isset($_SESSION['order_id'])) {
    $order_id = $_SESSION['order_id']; // from session after payment
} elseif (isset($_GET['order_id'])) {
    $order_id = intval($_GET['order_id']); // from GET request
}

// Fetch and return the order details if order_id is present
if ($order_id) {
    $response = fetchOrderDetails($conn, $order_id);
    header('Content-Type: application/json');
    echo json_encode($response);

    // Close connection
    $conn->close();
} else {
    // No order ID available
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'No order ID provided.']);
}
?>

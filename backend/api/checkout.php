<?php
header("Access-Control-Allow-Headers: *");

$db = new PDO('sqlite:../data/dorayaki.db');
session_start();
function getDorayaki($id)
{
    global $db;
    $result = $db->prepare('SELECT * FROM DORAYAKI WHERE id_dorayaki = ?');
    $result->execute(array($id));
    $res = $result->fetch(PDO::FETCH_ASSOC);
    return $res;
}

// Get All User Item
if (isset($_GET['getItem']) && $_GET['getItem']) {
    $arr = array();

    foreach ($_SESSION['item'] as $key) {
        $arr[$key] = getDorayaki($key);
    }
    die(json_encode($arr));
}

// POST order item
if (isset($_POST['id'])) {
    array_push($_SESSION['item'], $_POST['id']);
    $_SESSION['user_id'] = $_POST['user_id'];
}
// Get Item based on dorayaki id
if (isset($_GET['id']) && isset($_GET['amt'])) {
    $result = getDorayaki($_GET['id']);
    $result['qty'] = $_GET['amt'];
    die(json_encode($result));
}

// POST Order
if (isset($_POST['data'])) {
    try {
        $json = $_POST['data'];
        $data = json_decode($json, true);
        $user_id = $_SESSION['user_id'];
        // Make New Order
        $query = <<<EOF
            INSERT INTO "order" (id_order, `time`, id_user)
            VALUES(NULL, datetime('now'), '$user_id');
            EOF;
        $db->exec($query);

        $result = $db->query('SELECT id_order from "order" ORDER BY id_order DESC Limit 1');
        $last_id = $result->fetch(PDO::FETCH_ASSOC)['id_order'];

        // Make Order Items
        $query = <<<EOF
            INSERT INTO 
            order_item(id_order, id_dorayaki, qty) 
            VALUES ('$last_id', ?, ?);
            EOF;

        // Update Sold Stock
        $query_stock = <<<EOF
            UPDATE dorayaki
            SET sold_stock = sold_stock + ?,
            stock = stock - ?
            WHERE id_dorayaki = ?
            EOF;

        $order_item = $db->prepare($query);
        $sold_stock = $db->prepare($query_stock);
        foreach ($data as $key => $value) {
            $order_item->execute(array($key, $value));
            $sold_stock->execute(array($value, $value, $key));
        }

        $_SESSION['item'] = array();
        die(json_encode(array("success" => true)));
    } catch (Exception $e) {
        die(json_encode(array("success" => false)));
    }
}

// Change stock
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        parse_str(file_get_contents('php://input'), $_PUT);
        $json = $_PUT['data'];
        $data = json_decode($json, true);
        $user_id = $_SESSION['user_id'];

        $query = <<<EOF
        UPDATE Dorayaki
        SET stock = ?
        WHERE id_dorayaki = ?;
        EOF;

        $update = $db->prepare($query);

        foreach ($data as $key => $value) {
            $update->execute(array($value, $key));
        }
        $_SESSION['item'] = array();
        die(json_encode(array("success" => true)));
    } catch (Exception $e) {
        die(json_encode(array("success" => false,)));
    }
}

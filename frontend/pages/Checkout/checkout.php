<?php
$db = new PDO('sqlite:../../../backend/data/dorayaki.db');


function getDorayaki($id) {
    global $db;
    $result = $db->prepare('SELECT * FROM DORAYAKI WHERE id_dorayaki = ?');
    $result->execute(array($id));
    $res = $result->fetch(PDO::FETCH_ASSOC);
    return $res;
}

// Get All User Item
if (isset($_GET['getItem']) && $_GET['getItem']) {
    $arr = array();
    foreach (json_decode($_COOKIE['order']) as $key => $value) {
        $arr[$key] = getDorayaki($key);
        $arr[$key]['qty'] = $value;
    }
    die(json_encode($arr));
}

// Get Total
if (isset($_GET['getTotal']) && $_GET['getTotal']) {
    $total = 0;
    foreach (json_decode($_COOKIE['order']) as $key => $value) {
        $temp = getDorayaki($key);
        $total += $value * $temp['price'];
    }
    die(json_encode(array("total" => $total)));
}

// Check Stock
if (isset($_GET['id']) && isset($_GET['amt'])) {
    $result = getDorayaki($_GET['id']);
    $order = json_decode($_COOKIE['order'], true);
    if ($result['stock'] >= $_GET['amt']) {
        $order[$_GET['id']] = $_GET['amt'];
        setcookie('order', 1);
        setcookie('order', json_encode($order));
    }
    $result['amt'] = $_GET['amt'];
    die(json_encode($result));
}

// Get Amount of order
if (isset($_GET['id'])) {
    $order = json_decode($_COOKIE['order'], true);
    die(json_encode(array("id" => $_GET['id'], "amt" => $order[$_GET['id']])));
}

// POST Order
if (isset($_POST['buy']) && $_POST['buy']) {
    $user_id = $_COOKIE['user_id'];
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
        SET sold_stock = sold_stock + ?
        WHERE id_dorayaki = ?
        EOF;

    $order_item = $db->prepare($query);
    $sold_stock = $db->prepare($query_stock);
    foreach (json_decode($_COOKIE['order']) as $key => $value) {
        $order_item->execute(array($key, $value));
        $sold_stock->execute(array($value, $key));
    }
    die(json_encode(array("success" => true)));
}

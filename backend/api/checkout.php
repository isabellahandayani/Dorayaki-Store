<?php
$db = new PDO('sqlite:../data/dorayaki.db');

function getDorayaki($id)
{
    global $db;
    $result = $db->prepare('SELECT * FROM DORAYAKI WHERE id_dorayaki = ?');
    $result->execute(array($id));
    $res = $result->fetch(PDO::FETCH_ASSOC);
    return $res;
}

// Check if Admin
if (isset($_POST['checkAdmin']) && $_POST['checkAdmin']) {
    $isAdmin = $_COOKIE['admin'] == 1 ? true : false;
    die(json_encode(array("isAdmin" => $isAdmin)));
}


// Get All User Item
if (isset($_GET['getItem']) && $_GET['getItem']) {
    $arr = array();
    foreach (json_decode($_COOKIE['item']) as $key => $value) {
        $arr[$key] = getDorayaki($key);
        $arr[$key]['qty'] = $value;
    }
    die(json_encode($arr));
}

// Get Total
if (isset($_GET['getTotal']) && $_GET['getTotal']) {
    $total = 0;
    foreach (json_decode($_COOKIE['item']) as $key => $value) {
        $temp = getDorayaki($key);
        $total += $value * $temp['price'];
    }
    die(json_encode(array("total" => $total)));
}

// Check Stock
if (isset($_GET['id']) && isset($_GET['amt'])) {
    $isAdmin = $_COOKIE['admin'] == 1 ? true : false;
    $result = getDorayaki($_GET['id']);
    $item = json_decode($_COOKIE['item'], true);
    if ($result['stock'] >= $_GET['amt'] || $isAdmin) {
        $item[$_GET['id']] = $_GET['amt'];
        setcookie('item', 1);
        setcookie('item', json_encode($item));
    }
    $result['amt'] = $_GET['amt'];
    $result['isAdmin'] = $isAdmin;
    die(json_encode($result));
}

// Get Amount of order
if (isset($_GET['id'])) {
    $item = json_decode($_COOKIE['item'], true);
    die(json_encode(array("id" => $_GET['id'], "amt" => $item[$_GET['id']])));
}

// POST Order
if (isset($_POST['buy']) && $_POST['buy']) {
    try {
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
            SET sold_stock = sold_stock + ?,
            stock = stock - ?
            WHERE id_dorayaki = ?
            EOF;

        $order_item = $db->prepare($query);
        $sold_stock = $db->prepare($query_stock);
        foreach (json_decode($_COOKIE['item']) as $key => $value) {
            $order_item->execute(array($key, $value));
            $sold_stock->execute(array($value, $value, $key));
        }
        setcookie('item', 1);
        setcookie('item', json_encode(array()));
        die(json_encode(array("success" => true)));
    } catch (Exception $e) {
        die(json_encode(array("success" => false)));
    }
}

// Change stock
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $query = <<<EOF
        UPDATE Dorayaki
        SET stock = ?
        WHERE id_dorayaki = ?;
        EOF;

        $update = $db->prepare($query);

        foreach (json_decode($_COOKIE['item'], true) as $key => $value) {
            $update->execute(array($value, $key));
            setcookie('item', 1);
            setcookie('item', json_encode(array()));
        }
        die(json_encode(array("success" => true, "isAdmin" => $_COOKIE['admin'])));
    } catch (Exception $e) {
        die(json_encode(array("success" => false, "isAdmin" => $_COOKIE['admin'])));
    }
}

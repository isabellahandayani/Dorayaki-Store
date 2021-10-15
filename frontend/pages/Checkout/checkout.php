<?php
$db = new PDO('sqlite:../../../backend/data/dorayaki.db');
// Check if admin
if ($_COOKIE['admin']) {
} else {
    // Get All User Item
    if (isset($_GET['getItem']) && $_GET['getItem']) {
        $result = $db->prepare('SELECT dorayaki_name, price, photo FROM DORAYAKI WHERE id_dorayaki = ?');
        $arr = array();
        foreach (json_decode($_COOKIE['order']) as $key => $value) {
            $arr[$key] = array();
            $result->execute(array($key));
            $res = $result->fetch(PDO::FETCH_OBJ);
            $arr[$key]['dorayaki_name'] = $res->dorayaki_name;
            $arr[$key]['price'] = $res->price;
            $arr[$key]['photo'] = $res->photo;
            $arr[$key]['amt'] = $value;
        }
        die(json_encode($arr));
    }

    // Get Total
    if (isset($_GET['getTotal']) && $_GET['getTotal']) {
        $result = $db->prepare('SELECT price FROM DORAYAKI WHERE id_dorayaki = ?');
        $total = 0;
        foreach (json_decode($_COOKIE['order']) as $key => $value) {
            $result->execute(array($key));
            $res = $result->fetch(PDO::FETCH_ASSOC);
            $total += $value * $res['price'];
        }
        die(json_encode(array("total" => $total)));
    }

    // Check Stock
    if (isset($_GET['id']) && isset($_GET['amt'])) {
        $result = $db->prepare('SELECT * FROM DORAYAKI WHERE id_dorayaki = ?');
        $result->execute(array($_GET['id']));
        $res = $result->fetch(PDO::FETCH_ASSOC);
        $order = json_decode($_COOKIE['order'], true);
        if ($res['stock'] >= $_GET['amt']) {
            $order[$_GET['id']] = $_GET['amt'];
            setcookie('order', 1);
            setcookie('order', json_encode($order));
            $arr = array();
            die(json_encode(array("id" => $_GET['id'], "amt" => $order[$_GET['id']], "price" => $res['price'], "name" => $res['dorayaki_name'], "status" => (bool) 1)));
        }
        die(json_encode(array("id" => $_GET['id'], "amt" => $order[$_GET['id']], "status" => (bool) 0)));
    }

    // Get Amount of order
    if (isset($_GET['id'])) {
        $result = $db->prepare('SELECT * FROM DORAYAKI WHERE id_dorayaki = ?');
        $result->execute(array($_GET['id']));
        $res = $result->fetch(PDO::FETCH_ASSOC);

        $order = json_decode($_COOKIE['order'], true);

        die(json_encode(array("id" => $_GET['id'], "amt" => $order[$_GET['id']])));
    }

    // Buy
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
        $order_item = $db->prepare($query);
        foreach (json_decode($_COOKIE['order']) as $key => $value) {
            $order_item->execute(array($key, $value));
        }
        die(json_encode(array("success" => true)));
    }
}

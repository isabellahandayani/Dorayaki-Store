<?php
    // Dummy user id 
    $id_user = 1;
    $db = new PDO('sqlite:../../../backend/data/dorayaki.db');


    if(isset($_GET['getHistory']) && $_GET['getHistory']) {
        $query= <<<EOF
            SELECT id_order, `time`, dorayaki_name, qty, qty*price AS sum, id_dorayaki 
            FROM "order" natural join order_item natural join dorayaki
            WHERE id_user = '$id_user'            
            ORDER BY  `time` ASC;
        EOF;
        $result = $db->query($query);
        $arr = array();
        while($row = $result->fetch(PDO::FETCH_ASSOC)) {
            // Check for same ID Order with previous
            if(array_key_exists($row['id_order'], $arr)) {
                $arr[$row['id_order']][$row['id_dorayaki']] = array("time" => $row['time'], "dorayaki_name" => $row['dorayaki_name'], "qty" => $row['qty'], "sum" => $row['sum']);

            } else {
                $arr[$row['id_order']] = array();
                $arr[$row['id_order']][$row['id_dorayaki']] = array("time" => $row['time'], "dorayaki_name" => $row['dorayaki_name'], "qty" => $row['qty'], "sum" => $row['sum']);
            }
        }
        die(json_encode($arr));
    }

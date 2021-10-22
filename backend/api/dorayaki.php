<?php
    try{
        $db = new PDO('sqlite:../data/dorayaki.db');
    } catch (Exception $e) {
        echo $e;
    }

    $condition = "";

    if (isset($_GET['name'])){
        $name = $_GET['name'];
        $condition = "WHERE dorayaki_name LIKE '%$name%'";
    }

    $query = <<<EOF
        SELECT id_dorayaki, dorayaki_name, price, photo
        FROM dorayaki
        $condition
        ORDER BY sold_stock
        EOF;
    
    $results = $db->query($query);
    die(json_encode($results->fetchAll(PDO::FETCH_ASSOC)));
?>
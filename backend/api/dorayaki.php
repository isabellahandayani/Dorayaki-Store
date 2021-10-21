<?php
    $db = new PDO('sqlite:../data/dorayaki.db');

    $condition = "";

    if (isset($_GET['name'])){
        $name = $_GET['name'];
        $condition = "WHERE dorayaki_name LIKE '%$name%'";
    }

    $query = <<<EOF
        SELECT id_dorayaki, dorayaki_name, price, photo
        FROM dorayaki
        $condition
        EOF;
    
    $results = $db->query($query);
    echo json_encode($results->fetchAll(PDO::FETCH_ASSOC));
    
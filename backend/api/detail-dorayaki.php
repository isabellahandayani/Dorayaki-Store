<?php
    $db = new PDO('sqlite:../data/dorayaki.db');

    if (isset($_GET['id_dorayaki'])){
        $id = $_GET['id_dorayaki'];

        $query = <<<EOF
            SELECT *
            FROM dorayaki
            WHERE id_dorayaki = $id
            EOF;
        
            $result = $db->query($query);

            $dorayaki = $result->fetch(PDO::FETCH_ASSOC);
            if (!empty($dorayaki))
                die(json_encode(
                    array(
                        "statusCode" => 200,
                        "data" => $dorayaki
                    )
                ));
            else die(json_encode(
                array(
                    "statusCode" => 400,
                    "message" => "Dorayaki Not Found!"
                )
            ));
    }

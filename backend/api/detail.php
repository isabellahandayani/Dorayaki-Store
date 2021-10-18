<?php
    $db = new PDO('sqlite:../data/dorayaki.db');



    // Delete Dorayaki
    if ('DELETE' === $_SERVER['REQUEST_METHOD']) {
        try {
            parse_str(file_get_contents('php://input'), $_DELETE);
            $query = <<<EOF
                DELETE FROM dorayaki
                WHERE id_dorayaki = ?
            EOF;
            $delete = $db->prepare($query);
            $delete->execute(array($_DELETE['id']));
            die(json_encode(array("success" => true)));
        } catch (Exception $e) {
            die(json_encode(array("success" => false)));
        }

    }

<?php
    $db = new PDO('sqlite:../data/dorayaki.db');
    // Delete Dorayaki
    if ('DELETE' === $_SERVER['REQUEST_METHOD']) {
        try {
            parse_str(file_get_contents('php://input'), $_DELETE);
            // Get Path to Dorayaki Image
            $getItem = <<<EOF
            SELECT photo
            FROM dorayaki
            WHERE id_dorayaki = ?
            EOF;
            $path = $db->prepare($getItem);
            $path->execute(array($_DELETE['id']));
            
            
            // Delete from database
            $query = <<<EOF
            DELETE FROM dorayaki
            WHERE id_dorayaki = ?
            EOF;
            $delete = $db->prepare($query);
            $delete->execute(array($_DELETE['id']));
            
            // Delete image
            $res = $path->fetch(PDO::FETCH_ASSOC);
            unlink('../image/' . $res['photo']);
            die(json_encode(array("statusCode" => true)));
        } catch (Exception $e) {
            die(json_encode(array("statusCode" => false)));
        }
    }

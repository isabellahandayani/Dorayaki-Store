<?php
    $db = new PDO('sqlite:../data/dorayaki.db');

    date_default_timezone_set('Asia/Jakarta');

    if(!empty(['email']) && !empty($_POST['username'])){
        $email = $_POST['email'];
        $username = $_POST['username'];
        $query = <<<EOF
            SELECT email, username
            FROM user
            WHERE email='$email' OR username='$username'
        EOF;

        $result = $db->query($query);
        $user = $result->fetch(PDO::FETCH_ASSOC);

        if (empty($user)){
            // Encrpytion Settings
            $ecrpytion_key = "SPIDERMANWEB";
            $ciphering = "aes-128-ctr";
            $options = 0;  
            $encryption_iv = '1234567891011121';
            $pass = openssl_encrypt($_POST['password'], $ciphering, $ecrpytion_key, $options, $encryption_iv);

            // Session Time
            $is_admin = $_POST['is_admin'];

            $query = <<<EOF
                INSERT INTO user (email, password, username)
                VALUES ('$email','$pass','$username')
            EOF;

            $result = $db->exec($query);

            $id = $db->lastInsertId();

            $end_time = date("Y-m-d H:i:s", strtotime('+2 hours'));

            die(json_encode(
                array(
                    "statusCode" => 200,
                    "sessionID" => $id.'-'.$username,
                    "isAdmin" => 0,
                    "sessionEnd" => $end_time,
                )
            ));
        }else {
            $message = $user['email'] == $email ? "Email already exist!" : "Username already exist!";
            die(json_encode(
                array(
                    "statusCode" => 400,
                    "message" => $message
                )
            ));
            
        }
    }
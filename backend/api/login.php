<?php
    session_start();
    $ecrpytion_key = "SPIDERMANWEB";
    $ciphering = "aes-128-ctr";
    $options = 0;  
    $encryption_iv = '1234567891011121';
    $db = new PDO('sqlite:../data/dorayaki.db');
    
    date_default_timezone_set('Asia/Jakarta');
    
    if(!empty(['username']) && !empty($_POST['password'])){
        $username = $_POST['username'];
        $pass = openssl_encrypt($_POST['password'], $ciphering, $ecrpytion_key, $options, $encryption_iv);
        $query = <<<EOF
            SELECT id_user, username, is_admin
            FROM user
            WHERE username='$username' AND password='$pass'
        EOF;

        $result = $db->query($query);
        $user = $result->fetch(PDO::FETCH_ASSOC);

        if (isset($user) && !empty($user)){
            $_SESSION['item'] = array();
            $_SESSION['user_id'] = $user['id_user'];
            $end_time = date("Y-m-d H:i:s", strtotime('+2 hours'));

            die(json_encode(
                array(
                    "statusCode" => 200,
                    "sessionID" => $user['id_user'].'-'.$user['username'],
                    "isAdmin" => $user['is_admin'],
                    "sessionEnd" => $end_time 
                )
            ));
        }else {
            die(json_encode(
                array(
                    "statusCode" => 400,
                    "message" => "User Not Found!"
                )
            ));
        }
    }
?>
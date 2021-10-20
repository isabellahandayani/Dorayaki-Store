<?php
    session_start();
    $item = array("42");
    $_SESSION['item'] = $item;
    $_SESSION['admin'] = true;
    $_SESSION['user_id'] = 2;
?>
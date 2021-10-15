<?php

    $order = array("34" => 1, "33" => 1);
    setcookie("order", json_encode($order));
    setcookie("admin", 0);
    setcookie("user_id", 1);
?>
<?php
  $db = new PDO('sqlite:../data/dorayaki.db');

  // Get all users
  $query = <<<EOF
            SELECT username
            FROM user
            EOF;

  $resultQuery = $db->query($query);
  $usernames = $resultQuery->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($usernames);
?>
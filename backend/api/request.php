<?php
// Initialize WS with the WSDL
// phpinfo();
$client = new SoapClient("http://localhost:1111/request?wsdl");

// Invoke WS method (Function1) with the request params 
$response = $client->__soapCall("getRequests", array());
$db = new PDO('sqlite:../data/dorayaki.db');

$query = <<<EOF
    SELECT update_at
    FROM dorayaki
    ORDER BY update_at DESC
    LIMIT 1
EOF;

$res = $db->query($query);
$update = $res->fetch(PDO::FETCH_ASSOC);

// Print WS response
die(json_encode(array(
  "statusCode" => 200,
  "data" => $response->return,
  "lastUpdate" => $update['update_at']
)));
// echo $response;
?>
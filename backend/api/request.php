<?php
// Initialize WS with the WSDL
// phpinfo();
$client = new SoapClient("http://localhost:1111/request?wsdl");

// Invoke WS method (Function1) with the request params 
$response = $client->__soapCall("getRequests", array());

// Print WS response
die(json_encode(array(
  "statusCode" => 200,
  "data" => $response->return
)));
// echo $response;
?>
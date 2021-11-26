<?php
// Initialize WS with the WSDL
// phpinfo();
$client = new SoapClient("http://localhost:1111/request?wsdl");

// Invoke WS method (Function1) with the request params
$response = $client->postRequest(array("arg0" => $_POST["id_dorayaki"], "arg1" => $_POST["stok_added"]));

if ($response->return) {
  echo "<script>alert('Request berhasil diajukan!');window.location.href='../../frontend/pages/request/'</script>";
} else {
  echo "<script>alert('Request gagal diajukan!');window.location.href='../../frontend/pages/detail/'</script>";
}
?> 
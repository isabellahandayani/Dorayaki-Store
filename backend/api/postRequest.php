<?php



$xml_data = "<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">
            <Body>
                <postRequest xmlns=\"http://service.app_dorayaki_supplier/\">
                    <arg0 xmlns=\"\">"."1"."</arg0>
                </postRequest>
            </Body>
            </Envelope>";
$URL = "http://localhost:1111/api/request?wsdl";

$ch = curl_init($URL);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/xml'));
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "$xml_data");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
curl_close($ch);

$response1 = str_replace("<soap:Body>","",$output);
$response2 = str_replace("</soap:Body>","",$response1);


$parser = simplexml_load_string($response2);

var_dump($parser);


?>
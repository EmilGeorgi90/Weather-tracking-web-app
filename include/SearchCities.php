<?php
include "connect.php";
session_start();
$currTime = date("Y-m-d");
$sql = "SELECT * FROM weather";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
$Weather = $stmt->fetchAll();

function sendOutput($data, $httpHeaders=array())
{
    header_remove('Set-Cookie');
    if (is_array($httpHeaders) && count($httpHeaders)) {
        foreach ($httpHeaders as $httpHeader) {
            header($httpHeader);
        }
    }
    echo $data;
}
$strErrorDesc = '';
    try {      
        $arrWeather = $Weather;
        $responseData = json_encode($arrWeather);
    } catch (Error $e) {
        $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
        $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
    }
    // send output
    if (!$strErrorDesc) {
        sendOutput(
            $responseData,
            array('Content-Type: application/json', 'HTTP/1.1 200 OK')
        );
    } else {
        sendOutput(json_encode(array('error' => $strErrorDesc)), 
        array('Content-Type: application/json', $strErrorHeader));
    }
?>
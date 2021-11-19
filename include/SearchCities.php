<?php
include "connect.php";
session_start();
$currTime = date("Y-m-d");
$sql = "SELECT * FROM `weather` WHERE DATE(CurrentTime) = CURDATE();";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
$weather = $stmt->fetchAll();
$responseData = json_encode($weather);
echo $responseData;
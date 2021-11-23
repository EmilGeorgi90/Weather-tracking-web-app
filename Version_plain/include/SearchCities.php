<?php
include "connect.php";
session_start();
$sql = "SELECT * FROM `weather` WHERE DATE(created_at) = CURDATE();";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
$weather = $stmt->fetchAll();
$responseData = json_encode($weather);
echo $responseData;
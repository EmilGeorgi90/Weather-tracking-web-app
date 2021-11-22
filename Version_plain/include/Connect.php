<?php
$servername = "localhost";
$dbname = "weather_tracking_web_app";
$username = "root";
$password = "";
try {
    header('Access-Control-Allow-Origin: *');
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

?>
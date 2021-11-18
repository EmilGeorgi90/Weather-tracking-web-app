<?php
$servername = "localhost";
$dbname = "weater api";
$username = "root";
$password = "";
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //setting some cookie values
}
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }

?>
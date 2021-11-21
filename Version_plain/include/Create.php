<?php
    require "connect.php";
    $_POST = json_decode(file_get_contents("php://input"), true);
    try{
    $sql = "INSERT INTO `weather`(`city`, `temperature`) VALUES (?,?);";
    $statement = $conn->prepare($sql);
    $statement->bindParam(1, $_POST['city']);
    $statement->bindParam(2, $_POST['temperature']);
    $statement->execute();
    }
    catch(PDOException $e){
        echo "something failed". $e->getMessage();
    }

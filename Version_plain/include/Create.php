<?php
    require "connect.php";
    $_POST = json_decode(file_get_contents("php://input"), true);
    try{
        header('Access-Control-Allow-Origin: *');
        $sql = "INSERT INTO `weather`(`city`, `temperature`, `created_at`) VALUES (?,?,?);";
        $statement = $conn->prepare($sql);
        $statement->bindParam(1, $_POST['city']);
        $statement->bindParam(2, $_POST['temperature']);
        $statement->bindParam(3, $_POST['created_at']);        
        $statement->execute();
    }
    catch(PDOException $e){
        echo "something failed". $e->getMessage();
    }

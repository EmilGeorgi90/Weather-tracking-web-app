<?php
    require "connect.php";
    $sql = "INSERT INTO `weather`(`City`, `Temperature`) VALUES (?,?);";
    $statement = $conn->prepare($sql);
    $statement->bindParam(1, $_GET['city']);
    $statement->bindParam(2, $_GET['temp']);
    $statement->execute();
?>
<?php
$url = $_GET['url'];
$ret = file_get_contents($url); 
echo $_GET['callback']."(".json_encode($ret).")";
?>
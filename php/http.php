<?php
$type = $_GET['type'];
$callback = $_GET['callback'];
$url = 'http://v.juhe.cn/toutiao/index?type='.$type.'&&key=c699e89f1577064ecd4ae106e79ba761';
$ret = file_get_contents($url); 
echo $callback."(".json_encode($ret).")";
?>
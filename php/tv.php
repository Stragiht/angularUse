<?php
// $type = $_GET['type'];
$callback = $_GET['callback'];
$url = 'http://japi.juhe.cn/tv/getCategory?key=477156057093a74aea044323a8e1e79d';
$ret = file_get_contents($url);
// echo $ret;
 echo $callback."(".json_encode($ret).")";
?>
<?php
 $id = $_GET['id'];
$callback = $_GET['callback'];
//http://japi.juhe.cn/tv/getChannel?pId=1&key=您申请的KEY
//http://japi.juhe.cn/tv/getChannel?pId=1&key=477156057093a74aea044323a8e1e79d
$url = "http://japi.juhe.cn/tv/getChannel?pId=".$id."&key=477156057093a74aea044323a8e1e79d";
$ret = file_get_contents($url);
// echo $ret;
 echo $callback."(".json_encode($ret).")";
?>
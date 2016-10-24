<?php
 $type = $_GET['id'];
$callback = $_GET['callback'];
//http://japi.juhe.cn/tv/getProgram?code=cctv5&date=&key=您申请的KEY

$url = 'http://japi.juhe.cn/tv/getProgram?code='.$type.'&date=&key=477156057093a74aea044323a8e1e79d';
$ret = file_get_contents($url);
// echo $ret;
 echo $callback."(".json_encode($ret).")";
?>
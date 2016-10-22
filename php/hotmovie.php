<?php
$url = $_GET['url'];
// $url = 'https://api.douban.com/v2/movie/coming_soon';
$callback = $_GET['callback'];
$ret = file_get_contents($url);
echo $callback."(".json_encode($ret).")";
// echo $ret;
?>
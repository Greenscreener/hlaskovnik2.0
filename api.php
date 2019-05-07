<?php
include "credentials.php";
header("Content-type: application/json");

function apiError($message, $code) {
    http_response_code($code);
    echo('{"Error":"'.$message.'","Code":'.$code.'}');
}

$path = $_GET["path"];

if (strpos($path,  '/v2.0') === 0) {
    $version = 'v2.0';
    $regexVersion = str_replace(".","\.", $version);
    if (preg_match("/^\//".$regexVersion."\/hlasky\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":

                break;
            case "POST":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\//".$regexVersion."\/hlasky\/\d+\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\//".$regexVersion."\/hlasky\/\d+\/likes\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\//".$regexVersion."\/users\/\d+\/likes\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else {
        apiError("Not Found.", 404);
    }
} else {
    apiError("Version Not Found.", 404);
}
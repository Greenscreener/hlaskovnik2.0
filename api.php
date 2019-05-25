<?php
include "credentials.php";
header("Content-type: application/json");

function apiError($message, $code) {
    http_response_code($code);
    echo('{"Error":"'.$message.'","Code":'.$code.'}');
    return;
}
function sendResponse($data, $code) {
    http_response_code($code);
    for ($i = 0; $i < count($data); ++$i) {
        $data[$i] = get_object_vars($data[$i]);
    }
    $output = json_encode($data, JSON_NUMERIC_CHECK);
    if ($output === false) {
        apiError("JSON failed: " . json_last_error(), 500);
    }
    echo $output;

}
function dbSELECT($conn, $query, $class) {
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $arr = $stmt->fetchAll(PDO::FETCH_CLASS, $class);
    $stmt = null;
    sendResponse($arr, 200);
}

class Hlaska {

    public $id;
    public $date;
    public $content;
    public $edited;
    public $likes;
    public $teacher;

    private $teacher_id;
    private $teacher_firstName;
    private $teacher_lastName;
    private $teacherId;

    function __construct() {
        $this->teacher = [
            "id" => $this->teacher_id,
            "firstName" => $this->teacher_firstName,
            "lastName" => $this->teacher_lastName
        ];
    }

}
class Teacher {
    public $id;
    public $firstName;
    public $lastName;
}

$path = $_GET["path"];

if (strpos($path,  '/v2.0') === 0) {
    $version = 'v2.0';
    $regexVersion = str_replace(".","\.", $version);
    try {
        $options = [
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_CLASS,
        ];
        $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    }
    catch(PDOException $e)
    {
        apiError("Could not connect to database.", 500);
        return;
    }
    if (preg_match("/^\/".$regexVersion."\/hlasky\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                dbSELECT($conn,"SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id' FROM hlasky JOIN teachers t ON teacherId = t.id  ORDER BY hlasky.id DESC", 'Hlaska');
                break;
            case "POST":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/hlasky\/\d+\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/hlasky\/\d+\/likes\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/users\/\d+\/likes\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/users\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST":

                break;
            default:
                apiError("Method Not Allowed.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/teachers\/?/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                dbSELECT($conn, 'SELECT * FROM teachers ORDER BY lastName, firstName','Teacher');
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
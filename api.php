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
function dbSELECT($conn, $query, $class, $values = null) {
    $stmt = $conn->prepare($query);
    $stmt->execute($values);
    $arr = $stmt->fetchAll(PDO::FETCH_CLASS, $class);
    $stmt = null;
    if (empty($arr)) {
        apiError("Not Found.", 404);
    }
    sendResponse($arr, 200);
}

function recaptchaVerify($token) {
    global $recaptchaSecretKey;
    $url = "https://www.google.com/recaptcha/api/siteverify";
    $data = array("secret" => $recaptchaSecretKey, "response" => $token);
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return json_decode($result,true);
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
        if ($this->date === null) {
            $this->date = "0000-00-00";
        }
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
        $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password, $options);
    }
    catch(PDOException $e)
    {
        apiError("Could not connect to database.", 500);
        return;
    }
    if (preg_match("/^\/".$regexVersion."\/hlasky\/?$/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                if ($_GET["filterByTeacher"] === null && $_GET["filterByDate"] === null) {
                    dbSELECT($conn, "SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id', ((SELECT COUNT(*) FROM likes_by_user WHERE likes_by_user.hlaskaId = hlasky.id)+hlasky.likeOffset) AS likes FROM hlasky JOIN teachers t ON teacherId = t.id  ORDER BY hlasky.id DESC", 'Hlaska');
                } elseif ($_GET["filterByDate"] === null) {
                    dbSELECT($conn, "SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id', ((SELECT COUNT(*) FROM likes_by_user WHERE likes_by_user.hlaskaId = hlasky.id)+hlasky.likeOffset) AS likes FROM hlasky JOIN teachers t ON teacherId = t.id WHERE hlasky.teacherId = :teacherId ORDER BY hlasky.id DESC", 'Hlaska', ["teacherId" => $_GET["filterByTeacher"]]);
                } elseif ($_GET["filterByTeacher"] === null) {
                    dbSELECT($conn, "SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id', ((SELECT COUNT(*) FROM likes_by_user WHERE likes_by_user.hlaskaId = hlasky.id)+hlasky.likeOffset) AS likes FROM hlasky JOIN teachers t ON teacherId = t.id WHERE hlasky.date = :date ORDER BY hlasky.id DESC", 'Hlaska', ["date" => $_GET["filterByDate"]]);
                } else {
                    dbSELECT($conn, "SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id', ((SELECT COUNT(*) FROM likes_by_user WHERE likes_by_user.hlaskaId = hlasky.id)+hlasky.likeOffset) AS likes FROM hlasky JOIN teachers t ON teacherId = t.id WHERE hlasky.date = :date AND hlasky.teacherId = :teacherId ORDER BY hlasky.id DESC", 'Hlaska', ["date" => $_GET["filterByDate"], "teacherId" => $_GET["filterByTeacher"]]);
                }
                break;
            case "POST":
                $recaptchaResponse = recaptchaVerify(getallheaders()["g-recaptcha-response"]);
                if ($recaptchaResponse["success"] && $recaptchaResponse["score"] > 0.1 && $recaptchaResponse["action"] === "addQuote") {
                    if (getallheaders()["x-password"] === $passcode) {
                        $inputJSON = file_get_contents('php://input');
                        $input = json_decode($inputJSON, true);
                        $statement = $conn->prepare('INSERT INTO hlasky (teacherId, date, content) VALUES (:teacherId, :date, :content)');
                        $statement->execute([
                            'teacherId' => $input["teacher"],
                            'content' => $input["content"],
                            'date' => $input["date"]
                        ]);
                        http_response_code(201);
                        echo('{"Success": true, "Code": 201}');
                    } else {
                        apiError("Unauthorized.", 401);
                    }
                } else {
                    apiError("ReCaptcha failed.", 429);
                }
                break;
            default:
                apiError("Method '".$_SERVER["REQUEST_METHOD"]."' Not Allowed on path '".$path."'.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/hlasky\/(\d+)\/?$/", $path, $matches)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                $hlaskaId = $matches[1];
                dbSELECT($conn,"SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id', ((SELECT COUNT(*) FROM likes_by_user WHERE likes_by_user.hlaskaId = hlasky.id)+hlasky.likeOffset) AS likes FROM hlasky JOIN teachers t ON teacherId = t.id WHERE hlasky.id = :id  ORDER BY hlasky.id DESC", 'Hlaska', ["id" => $hlaskaId]);
                break;
            default:
                apiError("Method '".$_SERVER["REQUEST_METHOD"]."' Not Allowed on path '".$path."'.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/hlasky\/(\d+)\/likes\/?$/", $path, $matches)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST":
                $stmt = $conn->prepare("SELECT * FROM users WHERE userId = :userId");
                $stmt->execute(["userId" => $_COOKIE["userId"]]);
                $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (empty($arr)) {
                    apiError("User does not exist.", 404);
                    return;
                }
                try {
                    $stmt = $conn->prepare("INSERT INTO likes_by_user (userId, hlaskaId) VALUES (:userId,:hlaskaId)");
                    $stmt->execute([
                        "userId" => $_COOKIE["userId"],
                        "hlaskaId" => $matches[1]
                    ]);
                } catch (PDOException $e) {
                    if ($e->getCode() == 23000) {
                        apiError("Already liked.", 409);
                        return;
                    } else {
                        throw $e;
                    }
                }
                http_response_code(201);
                echo('{"Success": true, "Code": 201}');
                break;
            case "DELETE":
                $stmt = $conn->prepare("SELECT * FROM users WHERE userId = :userId");
                $stmt->execute(["userId" => $_COOKIE["userId"]]);
                $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (empty($arr)) {
                    apiError("User does not exist.", 404);
                    return;
                }

                $stmt = $conn->prepare("DELETE FROM likes_by_user WHERE hlaskaId = :hlaskaId AND userId = :userId");
                $stmt->execute([
                    "userId" => $_COOKIE["userId"],
                    "hlaskaId" => $matches[1]
                ]);

                http_response_code(201);
                echo('{"Success": true, "Code": 201}');
                break;
                break;
            default:
                apiError("Method '".$_SERVER["REQUEST_METHOD"]."' Not Allowed on path '".$path."'.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/users\/([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})\/likes\/?$/", $path, $matches)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                $stmt = $conn->prepare("SELECT hlaskaId FROM likes_by_user WHERE userId = :userId");
                $stmt->execute(["userId" => $matches[1]]);
                $arr = $stmt->fetchAll(PDO::FETCH_COLUMN);
                http_response_code(200);
                echo(json_encode($arr, JSON_NUMERIC_CHECK));
                break;
            default:
                apiError("Method '".$_SERVER["REQUEST_METHOD"]."' Not Allowed on path '".$path."'.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/users\/?$/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "POST":
                $recaptchaResponse = recaptchaVerify(getallheaders()["g-recaptcha-response"]);
                if ($recaptchaResponse["success"] && $recaptchaResponse["score"] > 0.5 && $recaptchaResponse["action"] === "newUser") {
                    $stmt = $conn->prepare("SELECT UUID()");
                    $stmt->execute();
                    $uuid = $stmt->fetch(PDO::FETCH_NUM)[0];
                    $stmt = $conn->prepare("INSERT INTO users (userId) VALUES (:uuid)");
                    $stmt->execute(["uuid" => $uuid]);
                    setcookie("userId", $uuid, 2147483647, "/");
                    http_response_code(201);
                    echo('{"Success": true, "Code": 201}');
                } else {
                    apiError("ReCaptcha failed.", 429);
                }
                break;
            default:
                apiError("Method '".$_SERVER["REQUEST_METHOD"]."' Not Allowed on path '".$path."'.", 405);
        }
    } else if (preg_match("/^\/".$regexVersion."\/teachers\/?$/", $path)) {
        switch ($_SERVER["REQUEST_METHOD"]) {
            case "GET":
                dbSELECT($conn, 'SELECT * FROM teachers ORDER BY lastName, firstName','Teacher');
                break;
            default:
                apiError("Method '".$_SERVER["REQUEST_METHOD"]."' Not Allowed on path '".$path."'.", 405);
        }
    } else {
        apiError("Endpoint Not Found.", 404);
    }
} else {
    apiError("Version Not Found.", 404);
}

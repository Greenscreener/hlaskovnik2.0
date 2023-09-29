<?php
include "credentials.php";
header("Content-type: application/atom+xml; charset=\"utf-8\"");

$stmt = $conn->prepare("SELECT hlasky.*, t.firstName AS 'teacher_firstName', t.lastName AS 'teacher_lastName', t.id AS 'teacher_id' FROM hlasky JOIN teachers t ON teacherId = t.id ORDER BY hlasky.edited DESC");
$stmt->execute();
$hlasky = $stmt->fetchAll();

$feed_updated = null;
if (sizeof($hlasky) > 0) {
    $feed_updated = $hlasky[0]['edited'];
}

// RFC4287 section 3.3
function toAtomDateConstruct($date_from_db) {
	return $date_from_db; //TODO
}

?><?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Hláškovník 2.0</title>
  <link href="https://hlaskovnik.eu"/>
  <updated><?php echo(htmlspecialchars(toAtomDateConstruct($feed_updated))); ?></updated>
  <author>
    <name>Greenscreener</name>
  </author>
  <id>urn:uuid:3fbed38a-bbdb-4877-adb4-88309f2229d9</id>

  <?php foreach ($hlaska as $hlasky) { ?>
  <entry>
    <title><?php echo(htmlspecialchars($hlaska['date'])); ?>: <?php echo(htmlspecialchars($hlaska['teacher_firstName'])); ?> <?php echo(htmlspecialchars($hlaska['teacher_lastName'])); ?></title>
    <link href="https://hlaskovnik.eu/?id=<?php echo(htmlspecialchars(urlencode((string)$hlaska['id']))); ?>"/>
    <id>https://hlaskovnik.eu/?id=<?php echo(htmlspecialchars(urlencode((string)$hlaska['id']))); ?></id>
    <updated><?php echo(htmlspecialchars(toAtomDateConstruct($hlaska['edited']))); ?></updated>
    <summary><?php echo(htmlspecialchars($hlaska['content'])); ?></summary>
  </entry>
  <?php } ?>
</feed>

<?php
header("Content-type: application/atom+xml; charset=\"utf-8\"");

// RFC4287 section 3.3
function toAtomDateConstruct($date_from_db) {
	return $date_from_db; //TODO
}

?><?php echo '<?xml version="1.0" encoding="utf-8"?>'?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Hláškovník 2.0</title>
  <link href="https://hlaskovnik.eu"/>
  <updated><?php echo(htmlspecialchars(toAtomDateConstruct($feed_updated))); ?></updated>
  <author>
    <name>Greenscreener</name>
  </author>
  <id>urn:uuid:3fbed38a-bbdb-4877-adb4-88309f2229d9</id>

  <?php foreach ($hlasky as $hlaska) { ?>
  <entry>
    <title><?php echo($hlaska->date == '0000-00-00' ? 'Neznámé datum' : htmlspecialchars($hlaska->date)); ?>: <?php echo(htmlspecialchars($hlaska->teacher->firstName)); ?> <?php echo(htmlspecialchars($hlaska->teacher->lastName)); ?></title>
    <link href="https://hlaskovnik.eu/?id=<?php echo(htmlspecialchars(urlencode((string)$hlaska->id))); ?>"/>
    <id>https://hlaskovnik.eu/?id=<?php echo(htmlspecialchars(urlencode((string)$hlaska->id))); ?></id>
    <updated><?php echo(htmlspecialchars(toAtomDateConstruct($hlaska->lastUpdate))); ?></updated>
    <summary><?php echo(htmlspecialchars($hlaska->content)); ?></summary>
  </entry>
  <?php } ?>
</feed>

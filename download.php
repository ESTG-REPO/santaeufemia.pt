<?php
if (!isset($_GET['file'])) {
    http_response_code(400);
    echo 'Missing file parameter.';
    exit;
}

$index = intval($_GET['file']);
if ($index < 1 || $index > 125) {
    http_response_code(400);
    echo 'Invalid file index.';
    exit;
}

$filename = "Festa-$index.jpg";
$remoteUrl = "https://cdn-dia1.xperia.pt/$filename";

// Use file_get_contents to fetch remote file
$imageData = file_get_contents($remoteUrl);
if ($imageData === false) {
    http_response_code(404);
    echo 'Image not found.';
    exit;
}

// Set headers to force download
header('Content-Description: File Transfer');
header('Content-Type: image/jpeg');
header("Content-Disposition: attachment; filename=\"$filename\"");
header('Content-Length: ' . strlen($imageData));
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Expires: 0');

echo $imageData;
exit;
?>

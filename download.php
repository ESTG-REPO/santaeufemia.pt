<?php
// Ensure the 'file' parameter is provided
if (!isset($_GET['file'])) {
    http_response_code(400);
    echo 'Missing file parameter.';
    exit;
}

// Sanitize and validate the filename
$filename = basename($_GET['file']);
$remote_url = "https://cdn-dia1.xperia.pt/" . rawurlencode($filename);

// Initialize cURL session
$ch = curl_init($remote_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

// Execute cURL request
$imageData = curl_exec($ch);

// Check for cURL errors
if ($imageData === false) {
    http_response_code(404);
    echo 'Image not found or failed to download.';
    curl_close($ch);
    exit;
}

// Get content type from cURL response
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// Set headers to prompt download
header('Content-Description: File Transfer');
header('Content-Type: ' . $contentType);
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Transfer-Encoding: binary');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Expires: 0');
header('Content-Length: ' . strlen($imageData));

// Output the image data
echo $imageData;
exit;
?>

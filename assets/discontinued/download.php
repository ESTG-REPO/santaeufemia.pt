<?php
// Define base URLs for each day
$baseUrls = [
    '1' => 'https://cdn-dia1-hd.xperia.pt/',
    '2' => 'https://cdn-dia2-hd.xperia.pt/',
    '3' => 'https://cdn-dia3-hd.xperia.pt/'
];

// Get and sanitize inputs
$day = isset($_GET['day']) ? $_GET['day'] : '';
$file = isset($_GET['file']) ? basename($_GET['file']) : '';

// Validate day
if (!array_key_exists($day, $baseUrls)) {
    http_response_code(400);
    echo 'Invalid day selected.';
    exit;
}

// Build full file URL
$fileUrl = $baseUrls[$day] . $file;

// Validate URL
$headers = @get_headers($fileUrl, 1);
if ($headers && strpos($headers[0], '200') !== false) {
    // Get content
    $content = file_get_contents($fileUrl);

    if ($content === false) {
        http_response_code(500);
        echo 'Failed to fetch the file.';
        exit;
    }

    // Output headers
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $file . '"');
    header('Content-Length: ' . strlen($content));
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    flush();

    // Output file content
    echo $content;
    exit;
} else {
    http_response_code(404);
    echo 'File not found.';
    exit;
}
?>

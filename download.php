<?php
// Ensure the image file exists and is valid
if (isset($_GET['file']) && !empty($_GET['file'])) {
    $file = $_GET['file'];

    // Specify the base URL for your CDN
    $baseUrl = 'https://cdn-dia1-hd.xperia.pt/Festa-';

    // Concatenate the full URL for the requested image
    $fileUrl = $baseUrl . $file . '.jpg';

    // Validate if the file is an image on the CDN
    if (filter_var($fileUrl, FILTER_VALIDATE_URL)) {
        // Set headers to force download
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="Festa-' . $file . '.jpg"');
        header('Content-Length: ' . getRemoteFileSize($fileUrl)); // Get file size remotely

        // Open the file from the CDN and output it
        readfile($fileUrl);
        exit;
    } else {
        // If the URL is not valid
        echo 'Invalid file URL!';
    }
} else {
    echo 'Invalid file request!';
}

// Function to get the file size of a remote file
function getRemoteFileSize($url) {
    $headers = get_headers($url, 1);
    return isset($headers['Content-Length']) ? $headers['Content-Length'] : 0;
}
?>

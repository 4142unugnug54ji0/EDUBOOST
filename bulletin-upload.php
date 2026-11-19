<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function base64UrlDecode(string $value): string|false
{
    $padded = strtr($value, '-_', '+/');
    $padded .= str_repeat('=', (4 - strlen($padded) % 4) % 4);
    return base64_decode($padded, true);
}

function listBulletinImages(): never
{
    $uploadDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'bulletin-uploads';
    if (!is_dir($uploadDirectory)) {
        respond(200, ['images' => []]);
    }
    if (is_link($uploadDirectory) || !is_readable($uploadDirectory)) {
        respond(500, ['error' => 'The bulletin image folder could not be read.']);
    }

    $extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $files = scandir($uploadDirectory);
    if ($files === false) {
        respond(500, ['error' => 'The bulletin image folder could not be read.']);
    }

    $images = [];
    foreach ($files as $filename) {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $path = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;
        if (in_array($extension, $extensions, true) && is_file($path) && !is_link($path)) {
            $images[] = [
                'image' => 'bulletin-uploads/' . rawurlencode($filename),
                'modified' => filemtime($path) ?: 0,
            ];
        }
    }

    usort($images, static fn(array $left, array $right): int => $right['modified'] <=> $left['modified']);
    respond(200, ['images' => array_column($images, 'image')]);
}

function deleteBulletinImage(): never
{
    $filename = $_POST['filename'] ?? '';
    if (!is_string($filename)
        || !preg_match('/\A[a-f0-9]{32}\.(?:jpg|jpeg|png|gif|webp)\z/i', $filename)) {
        respond(400, ['error' => 'The selected bulletin image is invalid.']);
    }

    $uploadDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'bulletin-uploads';
    if (!is_dir($uploadDirectory) || is_link($uploadDirectory) || !is_writable($uploadDirectory)) {
        respond(500, ['error' => 'The bulletin image folder is unavailable.']);
    }

    $path = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;
    if (is_link($path) || !is_file($path)) {
        respond(404, ['error' => 'The selected bulletin image no longer exists.']);
    }
    if (!unlink($path)) {
        respond(500, ['error' => 'The server could not delete this image.']);
    }

    respond(200, ['deleted' => true]);
}

function getFirebaseClaims(): array
{
    $authorization = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    if (preg_match('/^Bearer\s+(\S+)$/i', $authorization, $matches)) {
        $token = $matches[1];
    } else {
        $token = $_POST['firebaseToken'] ?? '';
    }

    if (!is_string($token) || $token === '') {
        respond(401, ['error' => 'Sign in before uploading an image.']);
    }

    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        respond(401, ['error' => 'The sign-in token is invalid. Please sign in again.']);
    }

    [$encodedHeader, $encodedClaims, $encodedSignature] = $parts;
    $header = json_decode(base64UrlDecode($encodedHeader) ?: '', true);
    $claims = json_decode(base64UrlDecode($encodedClaims) ?: '', true);
    $signature = base64UrlDecode($encodedSignature);

    if (!is_array($header) || !is_array($claims) || $signature === false
        || ($header['alg'] ?? '') !== 'RS256' || empty($header['kid'])) {
        respond(401, ['error' => 'The sign-in token is invalid. Please sign in again.']);
    }

    $curl = curl_init('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 8,
    ]);
    $certificateResponse = curl_exec($curl);
    $certificateStatus = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $certificateError = curl_error($curl);
    curl_close($curl);

    if (!is_string($certificateResponse) || $certificateStatus !== 200) {
        error_log('Firebase token certificate request failed: ' . $certificateError);
        respond(503, ['error' => 'Could not verify your sign-in right now. Please try again.']);
    }

    $certificates = json_decode($certificateResponse, true);
    $certificate = is_array($certificates) ? ($certificates[$header['kid']] ?? null) : null;
    if (!is_string($certificate)) {
        respond(401, ['error' => 'The sign-in token has expired. Please sign in again.']);
    }

    $verified = openssl_verify(
        $encodedHeader . '.' . $encodedClaims,
        $signature,
        $certificate,
        OPENSSL_ALGO_SHA256
    );

    $now = time();
    if ($verified !== 1
        || ($claims['aud'] ?? '') !== 'readingapp-c4818'
        || ($claims['iss'] ?? '') !== 'https://securetoken.google.com/readingapp-c4818'
        || !is_string($claims['sub'] ?? null)
        || $claims['sub'] === ''
        || !is_numeric($claims['exp'] ?? null)
        || (int) $claims['exp'] <= $now
        || !is_numeric($claims['iat'] ?? null)
        || (int) $claims['iat'] > $now + 60) {
        respond(401, ['error' => 'Your sign-in session is invalid or expired. Please sign in again.']);
    }

    return $claims;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Only bulletin image listing, uploads, or deletions are supported.']);
}

if (($_POST['action'] ?? '') === 'list') {
    listBulletinImages();
}

getFirebaseClaims();

if (($_POST['action'] ?? '') === 'delete') {
    deleteBulletinImage();
}

if (!isset($_FILES['image'])) {
    $requestSize = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($requestSize > 10 * 1024 * 1024) {
        respond(413, ['error' => 'The image is too large. Maximum size is 10 MB.']);
    }
    respond(400, ['error' => 'Choose an image file to upload.']);
}

$upload = $_FILES['image'];
if (!is_array($upload) || ($upload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $errorCode = is_array($upload) ? (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE) : UPLOAD_ERR_NO_FILE;
    $message = match ($errorCode) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The image is too large for the server upload limit.',
        UPLOAD_ERR_PARTIAL => 'The image upload was interrupted. Please try again.',
        UPLOAD_ERR_NO_FILE => 'Choose an image file to upload.',
        default => 'The server could not receive the image. Please try again.',
    };
    respond($errorCode === UPLOAD_ERR_INI_SIZE || $errorCode === UPLOAD_ERR_FORM_SIZE ? 413 : 400, ['error' => $message]);
}

$temporaryFile = $upload['tmp_name'] ?? null;
$maxBytes = 10 * 1024 * 1024;
if (!is_string($temporaryFile) || !is_uploaded_file($temporaryFile) || (int) ($upload['size'] ?? 0) <= 0) {
    respond(400, ['error' => 'The uploaded image is invalid.']);
}
if ((int) ($upload['size'] ?? 0) > $maxBytes) {
    respond(413, ['error' => 'The image is too large. Maximum size is 10 MB.']);
}

$extensions = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp',
];
$fileInfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $fileInfo->file($temporaryFile);
$imageInfo = @getimagesize($temporaryFile);

if (!is_string($mimeType) || !isset($extensions[$mimeType])
    || $imageInfo === false || ($imageInfo['mime'] ?? '') !== $mimeType) {
    respond(415, ['error' => 'Use a valid JPG, PNG, GIF, or WebP image.']);
}

$uploadDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'bulletin-uploads';
if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
    respond(500, ['error' => 'The server could not create the image folder.']);
}
if (is_link($uploadDirectory) || !is_writable($uploadDirectory)) {
    respond(500, ['error' => 'The bulletin image folder is not writable.']);
}

$filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mimeType];
$destination = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;
if (!move_uploaded_file($temporaryFile, $destination)) {
    respond(500, ['error' => 'The server could not save the image.']);
}

chmod($destination, 0644);
respond(201, ['image' => 'bulletin-uploads/' . $filename]);

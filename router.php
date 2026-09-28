<?php
/**
 * Fallback router: serve missing paths from gh-pages via jsDelivr
 * while Turhost FTP sync completes. Keeps medidentistanbul.com URLs.
 */
declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = rawurldecode($uri);
$uri = '/' . ltrim($uri, '/');

if (preg_match('#^/(tmp|wordpress-eski|cgi-bin)(/|$)#i', $uri)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Not found";
    exit;
}

$rel = ltrim($uri, '/');
if ($rel === '' || str_ends_with($uri, '/')) {
    $rel .= 'index.html';
}

if (str_contains($rel, '..') || str_contains($rel, "\0")) {
    http_response_code(400);
    exit;
}

$cdn = 'https://cdn.jsdelivr.net/gh/enesceylan190758-wq/medident-web-site@gh-pages/' . $rel;
$ctx = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 25,
        'header' => "User-Agent: MediDentRouter/1.0\r\nAccept: */*\r\n",
        'ignore_errors' => true,
    ],
]);

$body = @file_get_contents($cdn, false, $ctx);
$status = 502;
if (isset($http_response_header[0]) && preg_match('#\s(\d{3})\s#', $http_response_header[0], $m)) {
    $status = (int) $m[1];
}

if ($body === false || $status >= 400) {
    http_response_code($status >= 400 ? $status : 404);
    header('Content-Type: text/html; charset=utf-8');
    $local404 = __DIR__ . '/404.html';
    if (is_file($local404)) {
        readfile($local404);
    } else {
        echo '<!doctype html><title>404</title><h1>Sayfa bulunamadı</h1>';
    }
    exit;
}

$ext = strtolower(pathinfo($rel, PATHINFO_EXTENSION) ?: 'html');
$types = [
    'html' => 'text/html; charset=utf-8',
    'htm' => 'text/html; charset=utf-8',
    'css' => 'text/css; charset=utf-8',
    'js' => 'application/javascript; charset=utf-8',
    'json' => 'application/json; charset=utf-8',
    'xml' => 'application/xml; charset=utf-8',
    'txt' => 'text/plain; charset=utf-8',
    'svg' => 'image/svg+xml',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'webp' => 'image/webp',
    'ico' => 'image/x-icon',
    'woff2' => 'font/woff2',
];
header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('X-MediDent-Router: cdn');
header('Cache-Control: public, max-age=300');
http_response_code(200);
echo $body;

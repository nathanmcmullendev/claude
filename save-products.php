<?php
// save-products.php - Server-side save for RapidWoo Editor
// Place in project root

// CRITICAL: Set UTF-8 encoding
mb_internal_encoding('UTF-8');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST method required']);
    exit;
}

// Read raw input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

if (!isset($input['products']) || !is_array($input['products'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data: products array required']);
    exit;
}

// Path to products.json
$file = __DIR__ . '/data/products.json';

// Ensure data directory exists
$dir = dirname($file);
if (!is_dir($dir)) {
    if (!mkdir($dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create data directory']);
        exit;
    }
}

// Format JSON with proper UTF-8 handling
$data = json_encode(
    ['products' => $input['products']], 
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($data === false) {
    http_response_code(500);
    echo json_encode(['error' => 'JSON encode failed: ' . json_last_error_msg()]);
    exit;
}

if (file_put_contents($file, $data, LOCK_EX) !== false) {
    echo json_encode([
        'success' => true,
        'message' => 'Products saved to server',
        'productCount' => count($input['products']),
        'timestamp' => date('Y-m-d H:i:s'),
        'commit' => substr(md5($data), 0, 7)
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write file. Check folder permissions.']);
}

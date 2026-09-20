<?php

declare(strict_types=1);

$basePath = dirname(__DIR__);
$envPath = $basePath.'/.env';
$env = is_file($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : [];
$expectedToken = $env['DEPLOY_TOKEN'] ?? getenv('DEPLOY_TOKEN') ?: null;
$providedToken = $_POST['token'] ?? $_GET['token'] ?? '';

header('Content-Type: application/json');

if (! is_string($expectedToken) || $expectedToken === '' || ! hash_equals($expectedToken, (string) $providedToken)) {
    http_response_code(403);
    echo json_encode(['message' => 'Invalid deploy token']);
    exit;
}

$zipPath = $basePath.'/deploy.zip';
$archivePath = $basePath.'/deployments/deploy-'.date('Ymd-His').'.zip';

if (! is_file($zipPath)) {
    http_response_code(404);
    echo json_encode(['message' => 'deploy.zip was not found']);
    exit;
}

if (! is_dir(dirname($archivePath))) {
    mkdir(dirname($archivePath), 0755, true);
}

copy($zipPath, $archivePath);

$zip = new ZipArchive;

if ($zip->open($zipPath) !== true) {
    http_response_code(500);
    echo json_encode(['message' => 'Unable to open deploy.zip']);
    exit;
}

if (! $zip->extractTo($basePath)) {
    $zip->close();
    http_response_code(500);
    echo json_encode(['message' => 'Unable to extract deploy.zip']);
    exit;
}

$zip->close();
@unlink($zipPath);

echo json_encode(['message' => 'Deployment extracted successfully']);

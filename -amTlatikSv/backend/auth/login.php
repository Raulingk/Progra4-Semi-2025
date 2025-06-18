<?php
require '../db/conexion.php';

session_start();

$response = ['success' => false, 'message' => ''];

// Manejar solicitud OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Método no permitido';
    echo json_encode($response);
    exit;
}

// Obtener datos del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos
if (empty($data['email']) || empty($data['password'])) {
    $response['message'] = 'Email y contraseña son obligatorios';
    echo json_encode($response);
    exit;
}

try {
    // Buscar usuario por correo
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE correo = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if ($user && password_verify($data['password'], $user['password'])) {
        // Iniciar sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['correo'];
        
        $response = [
            'success' => true,
            'message' => '¡Bienvenido ' . $user['nombre'] . '!',
            'user' => [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'correo' => $user['correo'],
                'telefono' => $user['telefono'] ?? null,
                'region' => $user['region'] ?? null
            ]
        ];
    } else {
        $response['message'] = 'Credenciales incorrectas';
    }

} catch (PDOException $e) {
    $response['message'] = 'Error en el servidor: ' . $e->getMessage();
}

echo json_encode($response);
?>
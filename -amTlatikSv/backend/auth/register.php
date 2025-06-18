<?php
// Manejo de preflight request de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos y obtener el objeto PDO
$pdo = require_once '../db/conexion.php';

// Obtener los datos enviados en formato JSON
$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] === "POST" && $input) {
    $nombre = trim($input['nombre']);
    $apellido = trim($input['apellido']);
    $correo = trim($input['email']);
    $telefono = trim($input['telefono']);
    $region = trim($input['region']);
    $password = $input['password'];
    $confirmPassword = $input['confirmPassword'];

    // Validar que las contraseñas coincidan
    if ($password !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => '❌ Las contraseñas no coinciden.']);
        exit;
    }

    // Verificar si el correo ya está registrado (si fue enviado)
    if ($correo) {
        $stmtCorreo = $pdo->prepare("SELECT id FROM usuarios WHERE correo = :correo LIMIT 1");
        $stmtCorreo->execute([':correo' => $correo]);
        if ($stmtCorreo->fetch()) {
            echo json_encode(['success' => false, 'message' => '❌ El correo ya está registrado.']);
            exit;
        }
    }

    // Verificar si el teléfono ya está registrado
    $stmtTelefono = $pdo->prepare("SELECT id FROM usuarios WHERE telefono = :telefono LIMIT 1");
    $stmtTelefono->execute([':telefono' => $telefono]);
    if ($stmtTelefono->fetch()) {
        echo json_encode(['success' => false, 'message' => '❌ El teléfono ya está registrado.']);
        exit;
    }

    // Encriptar la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Insertar el usuario
        $sql = "INSERT INTO usuarios (nombre, apellido, correo, telefono, region, password) 
                VALUES (:nombre, :apellido, :correo, :telefono, :region, :password)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':apellido' => $apellido,
            ':correo' => $correo,
            ':telefono' => $telefono,
            ':region' => $region,
            ':password' => $passwordHash
        ]);

        echo json_encode([
            'success' => true,
            'user' => [
                'nombre' => $nombre,
                'apellido' => $apellido,
                'correo' => $correo,
                'telefono' => $telefono,
                'region' => $region
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => '❌ Error al registrar usuario: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Acceso denegado.']);
}
?>
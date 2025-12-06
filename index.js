<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
=======
// index.js - SERVIDOR API EXPRESS CORREGIDO
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
<<<<<<< HEAD
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

let db;

// ----------------------------------------------------
// 1. CONEXIÓN A LA BASE DE DATOS
// ----------------------------------------------------

async function connectToDatabase() {
    try {
        db = await createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            waitForConnections: true, // Espera si no hay conexiones disponibles
            connectionLimit: 10, // Máximo de 10 conexiones en el pool
            queueLimit: 0
=======
const port = 3001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

let db;

// 1. Conexión a la Base de Datos MySQL
async function connectToDatabase() {
    try {
        db = await createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
        });
        console.log('✅ Conexión a la base de datos MySQL exitosa.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
<<<<<<< HEAD
        process.exit(1);
=======
        process.exit(1); 
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
    }
}

// ----------------------------------------------------
<<<<<<< HEAD
// 2. ENDPOINT DE AUTENTICACIÓN
// ----------------------------------------------------

// POST: Endpoint de LOGIN (6)
app.post('/api/login', async (req, res) => {
    // El frontend envía 'usuario' (que mapeamos a nombre) y 'contrasena' (que mapeamos a password)
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: 'Faltan credenciales.' });
    }

    try {
        const query = `
            SELECT u.usuario_id, u.nombre, r.nombre_rol 
            FROM Usuario u
            JOIN Rol r ON u.rol_id = r.rol_id
            -- Usamos u.nombre y u.password según tu esquema
            WHERE u.nombre = ? AND u.password = ? 
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [usuario, contrasena]);

        if (rows.length === 1) {
            const user = rows[0];
            res.status(200).json({
                message: 'Login exitoso',
                usuarioId: user.usuario_id,
                nombre: user.nombre,
                rol: user.nombre_rol
            });
        } else {
            res.status(401).json({ error: 'Usuario o contraseña inválidos.' });
        }

    } catch (error) {
        console.error('Error durante la autenticación:', error);
        res.status(500).json({ error: 'Error del servidor al intentar autenticar.', details: error.message });
    }
});


// ----------------------------------------------------
// 3. ENDPOINTS DE CLIENTES
// ----------------------------------------------------

// GET: Listar todos los clientes (2)
app.get('/api/clientes', async (req, res) => {
    const query = `
        SELECT cliente_id, nombre, apellido, ciudad, telefono AS celular, cedula 
        FROM cliente
=======
// ENPOINTS DEL API
// ----------------------------------------------------

// 2. GET: Listar todos los clientes 
// ADAPTADO: Usando la tabla 'Cliente' y las columnas en minúsculas.
app.get('/api/clientes', async (req, res) => {
    // Nota: El nuevo esquema no tiene 'Apellido', el nombre es completo en 'nombre'
    const query = `
        SELECT cliente_id, nombre, ciudad, telefono AS celular, cedula 
        FROM Cliente
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
    `;
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener la lista de clientes:', error);
        res.status(500).json({ error: 'Error del servidor al obtener clientes' });
    }
});

<<<<<<< HEAD
// POST: Registrar un nuevo cliente (3)
app.post('/api/clientes', async (req, res) => {
    //Desestructurar TODOS los campos relevantes 
    const {
        nombre,
        apellido, 
        ciudad,
        cedula,
        celular, 
    } = req.body;

    if (!nombre || !apellido || !celular || !cedula) {
        // Esto solo se ejecuta si el frontend no validó, o si el body llegó incompleto
        return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, apellido, celular, cedula).' });
    }

    const query = `
        INSERT INTO cliente (nombre, apellido, ciudad, cedula, telefono) 
        VALUES (?, ?, ?, ?, ?)
    `;

    // 3. Los valores se pasan en el orden de la consulta.
    // Usamos 'celular' (variable del frontend) para el campo 'telefono' de la DB.
    const values = [
        nombre,
        apellido,
        ciudad,
        cedula,
        celular
    ];

    try {
        //'db.execute' es la función de tu conector MySQL
        const [result] = await db.execute(query, values);

        res.status(201).json({
            message: 'Cliente registrado con éxito',
            clienteId: result.insertId
        });
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        res.status(500).json({
            error: 'Error del servidor al registrar el cliente',
            details: error.message
        });
=======
// 3. POST: Registrar un nuevo cliente
// ADAPTADO: Usando la tabla 'Cliente' (no 'Clientes'). El apellido se asume parte del 'nombre'
app.post('/api/clientes', async (req, res) => {
    // Eliminamos 'apellido' porque no existe en la nueva tabla Cliente.
    const { nombre, ciudad, celular, cedula, apellido } = req.body; 
    
    // Concatenamos nombre y apellido para el campo 'nombre' si viene el apellido
    const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre;

    const query = `
        INSERT INTO Cliente (nombre, ciudad, telefono, cedula) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [nombreCompleto, ciudad, celular, cedula];

    try {
        const [result] = await db.execute(query, values);
        res.status(201).json({ 
            message: 'Cliente registrado con éxito', 
            clienteId: result.insertId 
        });
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        res.status(500).json({ error: 'Error del servidor al registrar el cliente', details: error.message });
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
    }
});


// ----------------------------------------------------
<<<<<<< HEAD
// 4. ENDPOINTS DE PRODUCTOS Y PEDIDOS
// ----------------------------------------------------

// GET: Listar todos los productos (4)
=======
// ENPOINTS DE PEDIDOS Y PRODUCTOS
// ----------------------------------------------------

// 4. GET: Listar todos los productos
// ADAPTADO: Usando la tabla 'Producto', 'producto_id' y 'precio_venta_base'
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
app.get('/api/productos', async (req, res) => {
    const query = `
        SELECT producto_id, nombre, precio_venta_base AS precio, unidad_medida 
        FROM Producto 
        ORDER BY nombre
    `;
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener productos' });
    }
});


<<<<<<< HEAD
// POST: Registrar un Pedido Completo (Transacción) (5)
app.post('/api/pedidos', async (req, res) => {
    const { clienteId, nota, items, usuarioAuxiliarId } = req.body;
=======
// 5. POST: Registrar un Pedido Completo (Transacción)
// ADAPTADO: Usa 'cliente_id' (INT) en la tabla 'Pedido' y 'Detalle_Pedido'.
// ADAPTADO: Asigna valores fijos para nuevos campos (usuario_auxiliar_id, estado_pedido, tipo_entrega).
app.post('/api/pedidos', async (req, res) => {
    // Ahora esperamos 'clienteId' (el ID INT) del frontend en lugar de solo la cédula
    const { clienteId, nota, items } = req.body; 
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513

    if (!items || items.length === 0 || !clienteId) {
        return res.status(400).json({ error: 'Faltan datos requeridos (Cliente ID o artículos).' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
<<<<<<< HEAD

        // 1. Insertar la Cabecera del Pedido
        const pedidoQuery = `
            INSERT INTO Pedido (cliente_id, usuario_auxiliar_id, fecha_pedido, estado_pedido, tipo_entrega, notas_cliente) 
            VALUES (?, ?, NOW(), 'En Preparacion', 'Urbana', ?)
        `;
        const [pedidoResult] = await connection.execute(pedidoQuery, [clienteId, usuarioAuxiliarId, nota]);
        const pedidoId = pedidoResult.insertId;

        // 2. Insertar los Detalles del Pedido
=======
        
        // 1. Insertar la Cabecera del Pedido
        // Usamos NOW(), estado_pedido='Recibido', tipo_entrega='Urbana', y un usuario ID fijo (1)
        const pedidoQuery = `
            INSERT INTO Pedido (cliente_id, usuario_auxiliar_id, fecha_pedido, estado_pedido, tipo_entrega, notas_cliente) 
            VALUES (?, 1, NOW(), 'Recibido', 'Urbana', ?)
        `;
        const [pedidoResult] = await connection.execute(pedidoQuery, [clienteId, nota]);
        const pedidoId = pedidoResult.insertId;

        // 2. Insertar los Detalles del Pedido
        // NOTA: El nuevo esquema de detalle no tiene 'empaque'. Usamos 'cantidad_solicitada' y 'precio_unitario_venta'.
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
        const detalleQuery = `
            INSERT INTO Detalle_Pedido (pedido_id, producto_id, cantidad_solicitada, precio_unitario_venta) 
            VALUES (?, ?, ?, ?)
        `;

<<<<<<< HEAD

        for (const item of items) {
            const cantidad = parseFloat(item.cantidad) || 0;
            const precio = parseFloat(item.precio) || 0;
            await connection.execute(detalleQuery, [
                pedidoId,
                item.productoId,
                cantidad,
                precio
=======
        for (const item of items) {
            // Buscamos el precio actual del producto (asumiendo que el item.precio viene del GET /api/productos)
            await connection.execute(detalleQuery, [
                pedidoId,
                item.productoId,
                item.cantidad,
                // item.precio viene del frontend y corresponde a precio_venta_base
                item.precio 
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
            ]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Pedido registrado con éxito', pedidoId });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al registrar el pedido:', error);
<<<<<<< HEAD
=======
        // Aquí puede aparecer un error si las FK no coinciden, por ejemplo, si cliente_id no existe.
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
        res.status(500).json({ error: 'Error del servidor al registrar el pedido', details: error.message });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});

<<<<<<< HEAD

// ENDPOINT: Obtener resumen detallado de todos los pedidos
app.get('/api/resumen', async (req, res) => {
    const query = `
     SELECT
        SUM(dp.cantidad_solicitada) AS cantidad, 
        p.unidad_medida AS empaque,
        p.nombre AS producto -- Frutas y Verduras
     FROM Detalle_Pedido dp
     JOIN Producto p ON dp.producto_id = p.producto_id
     
     GROUP BY
        p.unidad_medida,
        p.nombre 
     ORDER BY
        p.nombre, p.unidad_medida;
    `;

    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener el resumen de pedidos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener el resumen de pedidos.', details: error.message });
    }
});


// ----------------------------------------------------
// 5. INICIALIZACIÓN DEL SERVIDOR
// ----------------------------------------------------

// Inicializar Servidor (7)
=======
// 6. Inicializar Servidor
>>>>>>> c5c38a2929f268b610ff3434358e77d8c8156513
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`🚀 Servidor API Express escuchando en http://localhost:${port}`);
    });
}

startServer();
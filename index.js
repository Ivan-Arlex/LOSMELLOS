import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
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
        });
        console.log('✅ Conexión a la base de datos MySQL exitosa.');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

// ----------------------------------------------------
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
    `;
    try {
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener la lista de clientes:', error);
        res.status(500).json({ error: 'Error del servidor al obtener clientes' });
    }
});

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
    }
});


// ----------------------------------------------------
// 4. ENDPOINTS DE PRODUCTOS Y PEDIDOS
// ----------------------------------------------------

// GET: Listar todos los productos (4)
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

// POST: Registrar un Pedido Completo (Transacción) (5)
app.post('/api/pedidos', async (req, res) => {
    const { clienteId, nota, items, usuarioAuxiliarId } = req.body;

    if (!items || items.length === 0 || !clienteId) {
        return res.status(400).json({ error: 'Faltan datos requeridos (Cliente ID o artículos).' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insertar la Cabecera del Pedido
        const pedidoQuery = `
            INSERT INTO Pedido (cliente_id, usuario_auxiliar_id, fecha_pedido, estado_pedido, tipo_entrega, notas_cliente) 
            VALUES (?, ?, NOW(), 'En Preparacion', 'Urbana', ?)
        `;
        const [pedidoResult] = await connection.execute(pedidoQuery, [clienteId, usuarioAuxiliarId, nota]);
        const pedidoId = pedidoResult.insertId;

        // 2. Insertar los Detalles del Pedido
        const detalleQuery = `
            INSERT INTO Detalle_Pedido (pedido_id, producto_id, cantidad_solicitada, precio_unitario_venta) 
            VALUES (?, ?, ?, ?)
        `;

        for (const item of items) {
            const cantidad = parseFloat(item.cantidad) || 0;
            const precio = parseFloat(item.precio) || 0;
            await connection.execute(detalleQuery, [
                pedidoId,
                item.productoId,
                cantidad,
                precio
            ]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Pedido registrado con éxito', pedidoId });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al registrar el pedido:', error);
        res.status(500).json({ error: 'Error del servidor al registrar el pedido', details: error.message });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});


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
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`🚀 Servidor API Express escuchando en http://localhost:${port}`);
    });
}

startServer();
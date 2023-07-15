const { Pool } = require("pg")

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'supermercado',
    user: 'postgres',
    password: 'postgres'
})


const actualizacionPrecios = async () => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN") //Iniciar la transacción

        const consulta1 = { //Modificación del producto Arroz
            text: "UPDATE productos SET prod_precio = 1800 WHERE prod_id = $1 RETURNING *",
            values: [3]
        }
        const actualizacion1 = await client.query(consulta1)
        console.log(actualizacion1);


        const consulta2 = { //Modificación del producto Pasta
            text: "UPDATE productos SET prod_precio = 1900 WHERE prod_id = $1 RETURNING *",
            values: [7]
        }
        const actualizacion2 = await client.query(consulta2)
        console.log(actualizacion2);
        console.log("Ejecución exitosa");
        await client.query("COMMIT")
    } catch (error) {
        console.log(error.message);
        await client.query("ROLLBACK")
    } finally {
        await client.end()
    }
}

// actualizacionPrecios()

const procesoVenta = async() => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN") //Iniciar la transacción

        //Registro de Cliente
        const consultaCliente = {
            text: "INSERT INTO clientes(cl_rut, cl_dv, cl_nombre, cl_apellido, cl_direccion, cl_telefono, cl_correo,cl_fecha_nacimiento) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            values: [44444444, 4, "Luis", "Medina", "Santiago", "+56912345678","lmedina@mail.com","1980-05-15"]
        }
        const registroCliente = await client.query(consultaCliente);
        const idCliente = registroCliente.rows[0].cl_id
        console.log("idCliente", idCliente);
        //Fin Registro de Cliente


        //Registro de Colaborador
        const consultaColaborador = {
            text: "INSERT INTO colaboradores(col_rut, col_dv, col_nombre, col_apellido) VALUES($1, $2, $3, $4) RETURNING *",
            values: [5243077, 1, "María", "León"]
        }
        const registroColaborador = await client.query(consultaColaborador)
        const idColaborador = registroColaborador.rows[0].col_id
        console.log("idColaborador",idColaborador)
        // Fin Registro de Colaborador


        //Registro de Productos
        const consultaProducto1 = {
            text: "INSERT INTO productos(prod_codigo, prod_nombre, prod_precio, prod_stock) VALUES($1, $2, $3, $4) RETURNING *",
            values: ["MART001","Martillo", 25000, 100]
        }
        const registroProducto1 = await client.query(consultaProducto1)
        const idProducto1 = registroProducto1.rows[0].prod_id
        console.log("idProducto1", idProducto1);


        const consultaProducto2 = {
            text: "INSERT INTO productos(prod_codigo, prod_nombre, prod_precio, prod_stock) VALUES($1, $2, $3, $4) RETURNING *",
            values:["DEST001", "Destornillador de cruz", 15000, 250]
        }
        const registroProducto2 = await client.query(consultaProducto2)
        const idProducto2 = registroProducto2.rows[0].prod_id
        console.log("idProducto2", idProducto2);
        // Fin Registro de Productos



        // Registro de venta
        const consultaVenta = {
            text: "INSERT INTO ventas(ven_id_cliente, ven_id_colaborador, ven_id_tipo_comprobante, ven_fecha_hora, ven_iva, ven_tipo_pago) VALUES($1, $2, $3, NOW(), $4, $5) RETURNING *",
            values: [idCliente, idColaborador, 1, 19,"Efectivo"]
        }
        const registroVenta = await client.query(consultaVenta)
        const idVenta = registroVenta.rows[0].ven_numero_transaccion
        console.log("idVenta", idVenta);
        // Fin Registro de venta


        // Asociación de Productos a la venta
        const consultaVentaProducto1 = {
            text: "INSERT INTO ventas_productos(vp_numero_transaccion, vp_id_producto, cantidad) VALUES($1, $2, $3) RETURNING *",
            values: [idVenta, idProducto1, 1]
        }
        const registroVentaProducto1 = await client.query(consultaVentaProducto1)

        const consultaVentaProducto2 = {
            text: "INSERT INTO ventas_productos(vp_numero_transaccion, vp_id_producto, cantidad) VALUES($1, $2, $3) RETURNING *",
            values: [idVenta, idProducto2, 1]
        }
        const registroVentaProducto2 = await client.query(consultaVentaProducto2)
        // Fin  Asociación de Productos a la venta
        
        console.log("Ejecución exitosa");
        await client.query("COMMIT")
    } catch (error) {
        console.log(error.message);
        // Finalización de la transacción en caso de error.
        await client.query("ROLLBACK")
    } finally {
        client.end()
    }
}
procesoVenta()
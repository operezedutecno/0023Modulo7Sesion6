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
        const consultaCliente = {
            text: "INSERT INTO clientes(cl_rut, cl_dv, cl_nombre, cl_apellido, cl_direccion, cl_telefono, cl_correo,cl_fecha_nacimiento) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            values: [44444444, 4, "Luis", "Medina", "Santiago", "+56912345678","lmedina@mail.com","1980-05-15"]
        }
        const registroCliente = await client.query(consultaCliente);

        const idCliente = registroCliente.rows[0].cl_id


        // Ejecutar la consulta de registro de colaborador

        // Ejecutar consulta de registro de venta
        
        console.log(idCliente);
    } catch (error) {
        console.log(error.message);
    } finally {
        client.end()
    }
}
procesoVenta()
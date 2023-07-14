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

actualizacionPrecios()
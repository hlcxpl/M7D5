const { Pool } = require('pg')
const { format } = require('util')

const pool = new Pool({
    user: "postgres",
    password: "luispost",
    host: "localhost",
    database: "joyas",
    allowExitOnIdle: true
})

const obtenerJoyas = async ({ limits = 12, page = 0, order_by = "id_ASC" }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits
    const formatedQuery = format('select * from inventario order by %s %s limit %s offset %s', campo, direccion, limits, offset)
    pool.query(formatedQuery)
    const { rows: inventario } = await pool.query(formatedQuery)
    return inventario
}

const preparandoHATEOAS = (joyas) => {
    const results = joyas.map((j) => {
        return {
            name: j.nombre,
            href: `/joyas/joya/${j.id}`,
        }
    }).slice(0, 4)
    const total = joyas.length
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

const obtenerJoyasPorFiltros = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    const values = []
    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (categoria) agregarFiltro('categoria', '=', categoria)
    if (metal) agregarFiltro('metal', '=', metal)


    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows: joyas } = await pool.query(consulta, values)
    return joyas
}

module.exports = { obtenerJoyas, preparandoHATEOAS, obtenerJoyasPorFiltros }
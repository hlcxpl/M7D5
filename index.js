const express = require('express');
const app = express();
const cors = require('cors');
const { reportarConsulta } = require('./middlewares/reporte-consulta')
const { obtenerJoyas, preparandoHATEOAS, obtenerJoyasPorFiltros } = require('./consultas')


//Ensender el Servidor
app.listen(3000, () => console.log('SERVER ON'))
//cosrs
app.use(cors());
//Middleware
app.use(express.json())

app.get('/joyas', reportarConsulta, async (req, res) => {
    try {
        const queryString = req.query
        const joyas = await obtenerJoyas(queryString)
        const HATEOAS = await preparandoHATEOAS(joyas)
        res.json(HATEOAS)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/joyas/filtros', reportarConsulta, async (req, res) => {
    try {
        const queryStrings = req.query
        const joyas = await obtenerJoyasPorFiltros(queryStrings)
        res.json(joyas)
    } catch (error) {
        res.status(500).send(error)
    }
})
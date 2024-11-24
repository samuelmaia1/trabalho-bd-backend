import express from 'express'
import db from './db/db-config.js'

const app = express()

app.get('/', async (req, res) => {
    
})


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
})
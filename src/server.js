import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userController from './routes/User.js'
import productController from './routes/Product.js'
import orderController from './routes/Order.js'

dotenv.config()

const app = express()

app.use(cors())

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use('/usuarios', userController)
app.use('/produtos', productController)
app.use('/pedidos', orderController)

app.get('/', async (req, res) => {
    
})


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Rodando na porta ${process.env.SERVER_PORT}`)
})
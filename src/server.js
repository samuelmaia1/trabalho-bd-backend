import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import userController from './routes/User.js'
import productController from './routes/Product.js'
import orderController from './routes/Order.js'
import typeController from './routes/Type.js'

dotenv.config()

const app = express()
const port = 8080;


app.use(cors())

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use('/usuarios', userController)
app.use('/produtos', productController)
app.use('/pedidos', orderController)
app.use('/tipos-produtos', typeController)

app.get('/', (req, res) => res.send('ALOU!!!'));


app.listen(port, () => console.log(`App running on http://localhost:${port}`));


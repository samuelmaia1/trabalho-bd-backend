import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import userController from './routes/User.js';
import productController from './routes/Product.js';
import orderController from './routes/Order.js';
import typeController from './routes/Type.js';
import paymentController from './routes/Pagamanto.js';

dotenv.config();

// Set up the PostgreSQL pool
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Utility function for querying the database
const query = async (queryString, params) => {
  const client = await pool.connect();
  try {
    if (!params) {
      const res = await client.query(queryString);
      return res;
    }
    const res = await client.query(queryString, params);
    return res;
  } finally {
    client.release();
  }
};

// Set up Express app
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/usuarios', userController);
app.use('/produtos', productController);
app.use('/pedidos', orderController);
app.use('/tipos-produto', typeController);
app.use('/pagamentos', paymentController);

// Home route
app.get('/', (req, res) => res.send('ALOU!!!'));

// Recent changes endpoint
app.get('/recent-changes', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT * FROM change_log
      ORDER BY timestamp DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => console.log(`App running on http://localhost:${port}`));


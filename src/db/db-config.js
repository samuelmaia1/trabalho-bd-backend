import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const {Pool} = pkg

const pool = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

const query = async (queryString, params) => {
    const client = await pool.connect()
    try {
        if (!params){
            const res = await client.query(queryString)
            return res
        }    
        const res = await client.query(queryString, params)
        return res
    }
    finally{
        client.release()
    }
}

export default query
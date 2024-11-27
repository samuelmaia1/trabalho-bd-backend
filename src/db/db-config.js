import pkg from 'pg'
import dotenv from 'dotenv'
import express from 'express'
dotenv.config()

const {Pool} = pkg

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'mydb',
    password: 'postgres', 
    port: 5432, 
});

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

const app = express();




export default query
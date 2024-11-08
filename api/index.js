<<<<<<< HEAD
import express, { json } from 'express'
import cors from 'cors';
import { getAllUserData, insertNewUserData } from './helpers/db.js'
import dotenv from 'dotenv'
import { sendMessage } from './helpers/message.js';

dotenv.config();

const app = express();

app.use(json());
app.use(cors());


app.get('/api/numbers', async (req, res) => {
    const numbers = await getAllUserData();
    res.status(200).json(numbers);
});

app.post('/api/numbers', async (req, res) => {
    const { userName, number, state, seller } = req.body;

    if (!userName || !number || !state || !seller) {
        return res.status(400).json({ error: 'All fields are mandatory' });
    }

    const body = {
        "user_name": userName,
        number,
        state,
        seller
    }
    
    try {
        const newNumber = await insertNewUserData(body);
        if (newNumber === null) {
            return res.status(409).json({ error: 'Number already exists' });
        }
        sendMessage(seller, number);
        res.status(200).send(newNumber);
    } catch (err) {
        res.status(500).send(`error inserting new number`);
    }
});

app.listen(process.env.PORT,() => {
    console.log(`Server Runing Port ${process.env.PORT}`);
=======
import express, { json } from 'express'
import cors from 'cors';
import { getAllUserData, insertNewUserData } from './helpers/db.js'
import dotenv from 'dotenv'
import { sendMessage } from './helpers/message.js';

dotenv.config();

const app = express();

app.use(json());
app.use(cors());


app.get('/api/numbers', async (req, res) => {
    const numbers = await getAllUserData();
    res.status(200).json(numbers);
});

app.post('/api/numbers', async (req, res) => {
    const { userName, number, state, seller } = req.body;

    if (!userName || !number || !state || !seller) {
        return res.status(400).json({ error: 'All fields are mandatory' });
    }

    const body = {
        "user_name": userName,
        number,
        state,
        seller
    }
    
    try {
        const newNumber = await insertNewUserData(body);
        if (newNumber === null) {
            return res.status(409).json({ error: 'Number already exists' });
        }
        sendMessage(seller, number);
        res.status(200).send(newNumber);
    } catch (err) {
        res.status(500).send(`error inserting new number`);
    }
});

app.listen(process.env.PORT,() => {
    console.log(`Server Runing Port ${process.env.PORT}`);
>>>>>>> origin/master
});
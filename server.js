import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import sendProfile from './controllers/profile.js';
import handleImage from './controllers/image.js';
import handleCall from './controllers/api.js';
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port:5432,
      user : 'postgres',
      password : 'password',
      database : 'smartbrain'
    }
});
const app = express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res) => {res.send('it is working!')})
app.post('/signin',(req,res) => handleSignin(req,res,db,bcrypt));

app.post('/register',(req,res) => handleRegister(req,res,db,bcrypt));

app.get('/profile/:id',(req,res) => sendProfile(req,res,db));

app.post('/api',handleCall);

app.put('/image',(req,res) => handleImage(req,res,db));

app.listen(process.env.PORT || 3000);
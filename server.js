import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';
import { ClarifaiStub,grpc } from 'clarifai-nodejs-grpc';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import sendProfile from './controllers/profile.js';
import handleImage from './controllers/image.js';
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
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key d627f7d4e90340b9951c35e41a9cea81");
const handleCall = (req,res) => {
    stub.PostModelOutputs(
        {
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                res.status(400).json('api error')
                return;
            }
    
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                res.status(400).json('api error')
                return;
            }
            res.json(response);
        }
    );
};

app.use(cors());
app.use(express.json());

app.post('/signin',(req,res) => handleSignin(req,res,db,bcrypt));

app.post('/register',(req,res) => handleRegister(req,res,db,bcrypt));

app.get('/profile/:id',(req,res) => sendProfile(req,res,db));

app.post('/api',handleCall);

app.put('/image',(req,res) => handleImage(req,res,db));

app.listen(3000);
import {config} from 'dotenv'
config()
import express from 'express'
import chalk from 'chalk'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
import cors from 'cors'
import {route as cardRoute} from './routes/cards.js'
import {route as userRoute} from './routes/user.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret123'

const logDir = path.join(__dirname, '..', 'logs');
// Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

if (!process.env.DB_MONGO) {
    throw 'Please set up DB Atlas'
}

mongoose.connect(process.env.DB_MONGO)
    .then(() => console.log(chalk.blue("MongoDB connected successfully!!!")))
    .catch((err) => console.log((err)))


app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan('combined', {
    skip: (req, res) => {
        return res.statusCode < 400
    },
    stream: {
        write: message => {
            const date = new Date().toISOString().slice(0,10)  // Returns date in YYYY-MM-DD format
            const logFile = path.join(logDir, date + '.log');

            fs.appendFileSync(logFile, message);
        }
    }
}))

app.use(cors());
app.use(express.json());

// TODO: add auth

app.use(express.static(path.join(__dirname, 'public')));
app.use('/cards', cardRoute)
app.use('/users', userRoute)

const port = process.env.PORT
if (!Number.isInteger(Number(port))) {
    throw 'Please set up a port'
}
app.listen(port)
console.log(`Open api at port ${chalk.yellow(port)}`)
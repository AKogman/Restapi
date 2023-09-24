import express from 'express'
import joi from 'joi'
import { authPermission, generateAccessToken } from '../middleware/auth.js';
import User from '../schema/user.js';
import bcryptjs from 'bcryptjs';
import catchHandler from '../middleware/catchHandler.js';

export const route = express.Router()

const userSchema = joi.object({
    name: joi.object({
        first: joi.string().required(),
        middle: joi.string().allow('').required(),
        last: joi.string().required(),
    }),
    isBusiness: joi.boolean().required(),
    phone: joi.string().regex(/\d{3}-\d{7}/).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    address: joi.object({
        state: joi.string().allow(''),
        country: joi.string().allow('').required(),
        city: joi.string().allow('').required(),
        street: joi.string().allow('').required(),
        houseNumber: joi.string().required()
    }),
    image: joi.object({
        url: joi.string().allow('').required(),
        alt: joi.string().allow('')
    })
})

route.post('/', catchHandler(async (req, res, next) => {
    const { error, value: user } = userSchema.validate(req.body);
    if (error) return res.status(400).json(error);
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    const existing = await User.findOne({email: user.email})
    if (existing) return res.status(400).send('User already exist');
    const card = await User.create(user);
    res.json(card);
}))

const userSchemaLogin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})


route.post('/login', catchHandler(async (req, res, next) => {
    const { error, value } = userSchemaLogin.validate(req.body);
    if (error) return res.status(400).send(error);
    const existing = await User.findOne({email: value.email})
    if (existing == null) return res.status(403).send('User doe not exist');
    const match = await bcryptjs.compare(value.password, existing.password!)
    if (!match) {
        const HOURS24 = 1000*60*60*24
        if (!!existing.lockedFrom && (new Date().valueOf() - existing.lockedFrom.valueOf()) <= HOURS24) {
            res.send('User is locked')
            return;
        }
        if ((existing.loginAttempts || 0) >= 2) {
            await User.findByIdAndUpdate(existing._id, {loginAttempts: 0, lockedFrom: new Date()})
            res.send('User has been locked for 24 hours')
            return;
        }
        await User.findByIdAndUpdate(existing._id, {$inc: {loginAttempts: 1}})
        res.send('Password is incorrect')
        return
    } else {
        await User.findByIdAndUpdate(existing._id, {loginAttempts: 0, lockedFrom: null}) // reset
    }
    const token = generateAccessToken(res, {
        _id: existing._id!.toString(), 
        isAdmin: existing.isAdmin!, 
        isBusiness: existing.isBusiness!
    })
    res.send(token)
}))

route.get('/', authPermission(['admin']), catchHandler(async (req, res, next) => {
    const users = await User.find()
    res.json(users)
}))

route.get('/:id', authPermission(['user', 'admin']), catchHandler(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id)
    if (!user) return res.status(400).send("User doesnt not exist");
    res.json(user)
}))

route.put('/:id', authPermission(['user']), catchHandler(async (req, res, next) => {
    const id = req.params.id
    const { error, value } = userSchema.validate(req.body);
    if (error) return res.status(400).send(error);
    const salt = await bcryptjs.genSalt(10);
    value.password = await bcryptjs.hash(value.password, salt);
    const existing = await User.findOne({email: value.email})
    const user = await User.findByIdAndUpdate(id, value)
    if (!user) res.status(400).send("User doesnt not exist");
    res.json(user)
}))

const userSchemaPatch = joi.object({
    isBusiness: joi.boolean().required()
})

route.patch('/:id', authPermission(['user']), catchHandler(async (req, res, next) => {
    const id = req.params.id
    const { error, value } = userSchemaPatch.validate(req.body);
    if (error) return res.status(400).send(error);
    const user = await User.findByIdAndUpdate({_id: id}, value)
    if (!user) res.status(400).send("User doesnt not exist");
    res.json(user)
}))

route.delete('/:id', authPermission(['user', 'admin']), catchHandler(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)
    if (!user) return res.status(400).send("User doesnt not exist");
    res.json(user)
}))

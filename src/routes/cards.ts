import express from "express";
import joi from 'joi'
import Card from "../schema/card.js";
import { TokenData, authPermission } from "../middleware/auth.js";
import catchHandler from "../middleware/catchHandler.js";

export const route = express.Router()

route.get('/', catchHandler(async (req, res, next) => {
    const cards = await Card.find();
    res.json(cards);
}))

route.get('/my-cards', authPermission(['user']), catchHandler(async (req, res, next) => {
    const user = (req as any).auth as TokenData
    const cards = await Card.find({user_id: user._id})
    res.json(cards)
}))

route.get('/:id', catchHandler(async (req, res, next) => {
    const id = req.params.id
    const card = await Card.findById(id)
    if (!card) return res.status(400).send("Card does not exist");
    res.json(card)
}))

const cardSchema = joi.object({
    title: joi.string().required(),
    subtitle: joi.string().required().allow(''),
    description: joi.string().required().allow(''),
    phone: joi.string().regex(/\d{3}-\d{7}/).required(),
    email: joi.string().email().required(),
    web: joi.string().required().allow(''),
    image: joi.object({
        url: joi.string().allow('').required(),
        alt: joi.string().allow('')
    }),
    address: joi.object({
        state: joi.string().allow(''),
        country: joi.string().required(),
        city: joi.string().required(),
        street: joi.string().required(),
        houseNumber: joi.number().required(),
        zip: joi.string().required().allow('')
    }),
})

const cardSchemaBizNumber = joi.object({
    bizNumber: joi.number().required(),
})

route.post('/', authPermission(['business']), catchHandler(async (req, res, next) => {
    const user = (req as any).auth as TokenData
    const { error, value } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error);
    value.bizNumber = Math.ceil(Math.random() * 99999999999) // always override
    const card = await Card.create({...value, user_id: user._id});
    res.json(card)
}))

route.put('/:id', authPermission(['user', "admin"]), catchHandler(async (req, res, next) => {
    const user = (req as any).auth as TokenData
    const id = req.params.id
    if (user.isAdmin) {
        const { error, value } = cardSchemaBizNumber.validate(req.body);
        if (error) return res.status(400).send(error);
        const existingBiz = await Card.findOne(value)
        if (existingBiz) return res.status(400).send('A business number is already taken');
        const card = await Card.findByIdAndUpdate(id, value)
        res.json(card)
        return;
    }
    const { error, value } = cardSchema.validate(req.body);
    if (error) return res.status(400).send(error);
    const _card = await Card.findById(id)
    if (!_card) return res.status(400).send("Card does not exist");
    if (_card.user_id !== user._id) return res.status(400).send("Card does not belong to you");
    const card = await Card.findByIdAndUpdate(id, value)
    res.json(card)
}))

route.patch('/:id', authPermission(['user']), catchHandler(async (req, res, next) => {
    const user = (req as any).auth as TokenData
    const id = req.params.id
    const _card = await Card.findById(id)
    if (!_card) return res.status(400).send("Card does not exist");
    if (_card.user_id !== user._id) return res.status(400).send("Card does not belong to you");
    const card = await Card.findByIdAndUpdate(id, {
        likes: [...new Set([
            ...(_card.likes || []),
            user._id
        ])]
    })
    res.json(card)
}))

route.delete('/:id', authPermission(['user', 'admin']), catchHandler(async (req, res, next) => {
    const user = (req as any).auth as TokenData
    const id = req.params.id
    const _card = await Card.findById(id)
    if (!_card) return res.status(400).send("Card does not exist");
    // if admin, will always be false
    if (!user.isAdmin && _card.user_id !== user._id) return res.status(400).send("Card does not belong to you");
    res.json(await Card.findByIdAndDelete(id))
}))

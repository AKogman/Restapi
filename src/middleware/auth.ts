import express from 'express'
import jwt from 'jsonwebtoken'
import catchHandler from './catchHandler.js'

export type TokenData = {
    _id: string,
    isBusiness: boolean,
    isAdmin: boolean
}

function _authUser(req: express.Request, res: express.Response, next: (error: any, value: TokenData) => void) {
    const authHeader = req.headers?.['authorization'] as string ?? 'Bearer'
    const [, token] = authHeader.split(' ', 2) // Bearer ####

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, value: any) => {
        if (err) return res.status(403).send(err)
        next(err, value)
    })
}

export const authPermission = (flags: ('admin' | 'user' | 'business')[]) => catchHandler((req: express.Request, res: express.Response, next: (error?: any) => void) => {
    const isPemission = (error: any, data: TokenData) => {
        console.log(data)
        if (error) return next(error);
        (req as any).auth = data
        if (data.isAdmin && flags.includes('admin')) return next()
        if (data.isBusiness && flags.includes('business')) return next()
        if (flags.includes('user')) return next()
        res.sendStatus(403)
    }
    _authUser(req, res, isPemission)
})

export function generateAccessToken(res: express.Response, tokenObject: TokenData) {
    console.log(tokenObject)
    const token = jwt.sign(tokenObject, process.env.TOKEN_SECRET!, { expiresIn: '1800s' });
    return token
}
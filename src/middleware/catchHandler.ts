import { RequestHandler } from "express"

const catchHandler: (func: RequestHandler) => RequestHandler = (func: RequestHandler) => (req, res, next) => {
    try {
        func(req, res, next)
    } catch (err) {
        next(err)
    }
}
export default catchHandler
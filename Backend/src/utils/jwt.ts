import {sign,verify}    from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string
export const generateToken = (payload: any) => {
    return sign(payload, JWT_SECRET)
}
export const verifyToken = (token: string) => {
    return verify(token, JWT_SECRET)
}
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload{
    userId: string,
    role: string
}

export const generateToken = ({ userId, role }: TokenPayload) => {
    console.log("Secret", JWT_SECRET as string);
    return jwt.sign({ userId, role }, JWT_SECRET)
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
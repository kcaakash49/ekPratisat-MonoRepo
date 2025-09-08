import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload{
    userId: string,
    role: string
}

export const generateToken = ({ userId }: TokenPayload) => {
    return jwt.sign({ userId }, JWT_SECRET)
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
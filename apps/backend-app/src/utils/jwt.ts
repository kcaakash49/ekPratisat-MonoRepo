import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload{
    userId: string;
    role: string;
    name:string;
    profileImageUrl:string | null;
}

export const generateToken = ({ userId, role, name, profileImageUrl }: TokenPayload) => {
    return jwt.sign({ userId, role, name, profileImageUrl }, JWT_SECRET)
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
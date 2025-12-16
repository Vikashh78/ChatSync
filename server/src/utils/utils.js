import jwt from 'jsonwebtoken';

//function to generate Token for user
export const generateToken = (userId) => {
    const token = jwt.sign(
        {_id: userId},
        process.env.JWT_SECRET_TOKEN,
        {expiresIn: "7d"}
    )
    return token;
}
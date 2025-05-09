import jwt from 'jsonwebtoken';

const sign_token = (payload:unknown)=>{
    try {
        const token = jwt.sign(payload,'',{algorithm:'RS256'})
    } catch (error) {
        throw new Error('error at signing token');
    }
}
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        next(createHttpError(401, "Authorization header not found"));
        return;
    }

    const [bearer, accessToken] = authHeader.split(" ");
    if(bearer !== "Bearer" || !accessToken){
        next(createHttpError(401, "Auth header should be of type Bearer"));
        return;
    }

    const session = await SessionCollection.findOne({accessToken});
    if(!session){
        next(createHttpError(401, "Session not found"));
        return;
    }

    if(Date.now() > session.accessTokenValidUntil){
        next(createHttpError(401, "Access token expired"));
        return;
    }

    const user = await UsersCollection.findById({_id: session.userId});
    if(!user){
        next(createHttpError(401, "User not found"));
        return;
    }

    req.user = user;
    next();
}

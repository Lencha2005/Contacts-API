import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { findUserById } from '../services/auth.js';

export const checkToken = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        next(createHttpError(401, "Not authorizated"));
        return;
    }

    const [bearer, token] = authHeader.split(" ");
    if(bearer !== "Bearer" || !token){
        next(createHttpError(401, "Auth header should be of type Bearer"));
        return;
    }

    const { id } = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await findUserById(id);

    if (!user) {
      next(createHttpError(401, 'Not authorizated 3'));
      return;
    }

    req.user = user;
    next();
}

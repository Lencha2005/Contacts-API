import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

export const updateUserWithToken = (userId) => {
  const token = jwt.sign(
    {
      id: userId,
    },
    getEnvVar('JWT_SECRET'),
  );

  return UsersCollection.findByIdAndUpdate(userId, { token }, { new: true });
};

export const registerUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await UsersCollection.create({
    ...userData,
    password: hashPassword,
  });

  return updateUserWithToken(newUser._id);
};

export const loginUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });
  if (!user) throw createHttpError(401, 'User not found');

  const passwordCompere = await bcrypt.compare(
    userData.password,
    user.password,
  );

  if (!passwordCompere) throw createHttpError(401, 'User not found');

  return await updateUserWithToken(user._id);
};

export const logoutUser = (userId) =>
  UsersCollection.findByIdAndUpdate(userId, { token: '' });

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

    await sendEmail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html,
    });

};

export const resetPassword = async (userData) => {
  let entries;

  try {
    entries = jwt.verify(userData.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};



export const loginOrSignupWithGoogle = async (code) => {
    const loginTicket = await validateCode(code);
    const payload = loginTicket.getPayload();

    if (!payload) throw createHttpError(401);

    let user = await UsersCollection.findOne({ email: payload.email });

    if (!user) {
      const password = await bcrypt.hash(randomBytes(10).toString('hex'), 10);

      user = await UsersCollection.create({
        email: payload.email,
        name: getFullNameFromGoogleTokenPayload(payload),
        password,
      });
    }
    return await updateUserWithToken(user._id);
};


export const findUserById = (userId) => UsersCollection.findById(userId);

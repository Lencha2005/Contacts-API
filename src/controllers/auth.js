import {
  loginOrSignupWithGoogle,
  loginUser,
  logoutUser,
  registerUser,
  // requestResetToken,
  // resetPassword,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token: user.token,
  });
};

export const loginUserController = async (req, res) => {
  const user = await loginUser(req.body);

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token: user.token,
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.user._id);

  res.status(204).send();
};

export const refreshUserController = async (req, res) => {
  const user = req.user;

  res.json({
    name: user.name,
    email: user.email
  })
}

// export const requestResetEmailController = async (req, res) => {
//   await requestResetToken(req.body.email);

//   res.json({
//     status: 200,
//     message: 'Reset password email has been successfully sent.',
//     data: {},
//   });
// };

// export const resetPasswordController = async (req, res) => {
//   await resetPassword(req.body);
//   res.json({
//     status: 200,
//     message: 'Password has been successfully reset.',
//     data: {},
//   });
// };

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.status(200).json(url);
};

export const loginWithGoogleController = async (req, res) => {
  const user = await loginOrSignupWithGoogle(req.body.code);

  res.json({
    user: {
      name: user.name,
      email: user.email,
    },
    token: user.token,
  });
};

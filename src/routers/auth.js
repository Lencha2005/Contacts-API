import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginSchema,
  loginWithGoogleOAuthSchema,
  registerSchema,
  // requestResetEmailSchema,
  // resetPasswordSchema,
} from '../validation/auth.js';

import {
  loginUserController,
  registerUserController,
  logoutUserController,
  // requestResetEmailController,
  // resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
  refreshUserController,
} from '../controllers/auth.js';
import { checkToken } from '../middlewares/checkToken.js';

const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', checkToken, ctrlWrapper(logoutUserController));

authRouter.get('/current', checkToken, ctrlWrapper(refreshUserController));

// authRouter.post(
//   '/send-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );

// authRouter.post(
//   '/reset-pwd',
//   validateBody(resetPasswordSchema),
//   ctrlWrapper(resetPasswordController),
// );

authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

authRouter.post(
  '/confirm-google-auth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default authRouter;

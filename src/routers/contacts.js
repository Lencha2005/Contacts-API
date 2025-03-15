import { Router } from 'express';
import { createContactController, deleteContactController, getContactByIdController, getContactsController, patchContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { checkToken } from '../middlewares/checkToken.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(checkToken);

contactsRouter.get("/", ctrlWrapper(getContactsController));

contactsRouter.get("/:contactId", isValidId,  ctrlWrapper(getContactByIdController));

contactsRouter.post("/", upload.single("photo"), validateBody(createContactSchema), ctrlWrapper(createContactController));

contactsRouter.patch("/:contactId", upload.single("photo"), isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

contactsRouter.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;

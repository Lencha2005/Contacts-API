import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await getContacts(req.user._id);

  res.json(contacts);
};

export const createContactController = async (req, res) => {
  const contact = await createContact({ ...req.body, userId: req.user._id });

  res.status(201).json(contact);
};

export const patchContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.body, userId);

  if (!result) {
    throw createHttpError(404, `Contact not found`);
  }

  res.status(200).json(result);
};

export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, `Contact not found`);
  }

  res.json(deletedContact);
};

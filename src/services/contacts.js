import { ContactsCollection } from '../db/models/contact.js';

export const getContacts = (userId) => ContactsCollection.find({ userId });

export const createContact = (contactData) =>
  ContactsCollection.create(contactData);

export const updateContact = async (contactId, contactData, userId, options = {}) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    contactData ,
    {
      new: true,
      ...options,
    },
  );

  return updatedContact;
};

export const deleteContact = (filter) =>
  ContactsCollection.findOneAndDelete(filter);

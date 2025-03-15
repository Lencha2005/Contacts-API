import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = "_id",
    sortOrder = "asc",
    filter = {},
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if(filter.contactType){
        contactsQuery.where("contactType").equals(filter.contactType);
    };

    if (filter.isFavourite) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    }

    if(filter.userId){
        contactsQuery.where("userId").equals(filter.userId);
    }

    const totalItems = await ContactsCollection.find().merge(contactsQuery).countDocuments();
    const contacts = await contactsQuery.find().skip(skip).limit(limit).sort({[sortBy]: sortOrder});
    const paginationData = calculatePaginationData({totalItems, perPage, page});

    return {
        contacts,
        ...paginationData,
    }
};

export const getContactById = (filter) => ContactsCollection.findOne(filter);

export const createContact = (payload) =>  ContactsCollection.create(payload);

export const updateContact = async (filter, payload, options = {}) => {
    const result = await ContactsCollection.findOneAndUpdate(
        filter,
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if(!result || !result.value) return null;

    return {
        contact: result.value,
        isNew: Boolean(result?.lastErrorObject?.upserted)
    };
};

export const deleteContact = (filter) => ContactsCollection.findOneAndDelete(filter);



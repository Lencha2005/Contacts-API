import createHttpError from "http-errors";
import { createContact, deleteContact,  getContactById, getContacts, updateContact } from "../services/contacts.js"
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { sortByList } from "../constants/index.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";


export const getContactsController = async (req, res) => {
    const {page, perPage} = parsePaginationParams(req.query);
    const {sortBy, sortOrder} = parseSortParams(req.query, sortByList);
    const filter = parseFilterParams(req.query);
    filter.userId = req.user._id;


    const data = await getContacts({page, perPage, sortBy, sortOrder, filter});

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    })
};

export const getContactByIdController = async (req, res) => {
    const {_id: userId} = req.user;
    const {contactId: _id} = req.params;
    const data = await getContactById({_id, userId});

    if(!data) {
        throw createHttpError(404, `Contact not found`);
    }
    res.json({
        status: 200,
        message: `Successfully found contact with id ${_id}!`,
        data,
    })
};

export const createContactController = async (req, res) => {
    const {_id: userId} = req.user;
    const photo = req.file;
    let photoURL;

    if(photo){
        if(getEnvVar("ENABLE_CLOUDINARY") === "true") {
            photoURL = await saveFileToCloudinary(photo);
        } else {
            photoURL = await saveFileToUploadDir(photo);
        }
    };

    const data = await createContact({...req.body, photo: photoURL, userId});
    res.status(201).json ({
		status: 201,
		message: "Successfully created a contact!",
		data,
})
};

export const patchContactController = async (req, res) => {
    const {_id: userId} = req.user;
    const {contactId: _id} = req.params;
    const photo = req.file;
    let photoURL;

    if(photo){
        if(getEnvVar("ENABLE_CLOUDINARY") === "true") {
            photoURL = await saveFileToCloudinary(photo);
        } else {
            photoURL = await saveFileToUploadDir(photo);
        }
    }
    const result = await updateContact({_id, userId}, {
        ...req.body,
        photo: photoURL,
      });

    if(!result) {
        throw createHttpError(404, `Contact not found`);
    };

    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.contact,
    })
};

export const deleteContactController = async (req, res) => {
    const {_id: userId} = req.user;
    const {contactId: _id} = req.params;
    const data = await deleteContact({_id, userId});

    if(!data){
        throw createHttpError(404, `Contact not found`);
    }

    res.status(204).send();
}

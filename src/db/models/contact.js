import { Schema, model } from "mongoose";
import { emailRegex } from "../../constants/index.js";

const contactSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            match: emailRegex,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ["work", "home", "personal"],
            default: "personal",
            required: true,
        },
        photo: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
      },
);

export const ContactsCollection = model("contacts", contactSchema);

import { Schema, model } from "mongoose";

const contactSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
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

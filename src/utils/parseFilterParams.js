import { typeList } from "../constants/index.js";

const parseContactType = (contactType) => {
    if(typeof contactType !== "string") return undefined;
    if(typeList.includes(contactType)) return contactType;
    return undefined;
}

export const parseFilterParams = ({contactType, isFavourite}) => {
    const parsedContactType = parseContactType(contactType);
    const parsedIsFavourite = typeof isFavourite === "string" ? isFavourite : undefined;

    return {
        contactType: parsedContactType,
        isFavourite: parsedIsFavourite,
    }
}

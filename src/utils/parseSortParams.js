import { sortOrderList } from "../constants/index.js"

export const parseSortParams = ({sortBy, sortOrder}, sortByList) => {
    const parseSortOrder = sortOrderList.includes(sortOrder) ? sortOrder : sortOrderList[0];
    const parseSortBy = sortByList.includes(sortBy) ? sortBy : "_id";

    return {
        sortBy: parseSortBy,
        sortOrder: parseSortOrder,
    }
}

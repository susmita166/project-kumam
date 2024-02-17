const mapChildObjectKeyToArrayKey = async (arr, childObjectKey, isModelData = false) => {
    if (!childObjectKey || !arr) {
        return [];
    }
    let data = [];
    await arr.forEach((item, index) => {
        data[item[childObjectKey]] = (isModelData) ? item.dataValues : item;
    });
    return data;
}

const removeDuplicatesAndSort = (arr) => {
    const uniqueArray = [...new Set(arr)];
    uniqueArray.sort((a, b) => {
        if (typeof a === 'string') {
            return a.localeCompare(b);
        } else {
            return a - b;
        }
    });
    return uniqueArray;
}

module.exports = {
    mapChildObjectKeyToArrayKey,
    removeDuplicatesAndSort
}
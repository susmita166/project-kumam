const removeHtmlTags = (str) => {
    return str.replace(/(<([^>]+)>)/gi, "");
}

module.exports = {
    removeHtmlTags
}
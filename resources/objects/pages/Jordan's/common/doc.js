function getRelatedDocs(prop, value)
{
    // console.log(prop,value);
    const documentData = require("../../../data/document.json");
    return documentData.filter(doc => doc[prop]?.includes(value));
}
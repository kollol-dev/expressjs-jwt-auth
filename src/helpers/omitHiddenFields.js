const omit = require("lodash/omit")

module.exports = {
 omitFieldsFromObject: (obj, hiddenFields) => {
    return omit(obj, hiddenFields)
 }   
}
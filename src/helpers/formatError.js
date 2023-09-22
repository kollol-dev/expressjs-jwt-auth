module.exports = (errors) => {
    return errors.map(error => {
        // return error
        const message = error.message
        return { [error.path[0]]: message }
    })
}
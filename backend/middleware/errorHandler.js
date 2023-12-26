const { UNAUTHORIZED, BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../constants")

UNAUTHORIZED

const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500

    switch (statusCode) {
        case NOT_FOUND:
            res.json({ title: NOT_FOUND, message: err.message, stackTrace: err.stack })
            break;
        case BAD_REQUEST:
            res.json({ title: BAD_REQUEST, message: err.message, stackTrace: err.stack })
            break
        case FORBIDDEN:
            res.json({ title: FORBIDDEN, message: err.message, stackTrace: err.stack })
            break;
        case INTERNAL_SERVER_ERROR:
            res.json({ title: INTERNAL_SERVER_ERROR, message: err.message, stackTrace: stack })
            break;
        case UNAUTHORIZED:
            res.json({ title: UNAUTHORIZED, message: err.message, stackTrace: stack })
            break;
        default:
            console.log("No Error, Looks everything fine. status code : ", statusCode)
    }

}

module.exports = errorHandler
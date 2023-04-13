class ApiError extends Error {
    constructor(status, message, errors = []) {
        super();
        this.status = status
        this.message = message
        this.errors = errors
    }
    static unauthorized(message) {
        return new ApiError(401, message)
    }
    static badRequest(message, errors = []) {
        return new ApiError(404, message, errors)
    }
    static forbidden(message) {
        return new ApiError(403, message)
    }
    static internal(message) {
        return new ApiError(505, message)
    }
}

module.exports = ApiError
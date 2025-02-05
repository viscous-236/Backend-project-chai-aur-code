class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code for the response
        this.data = data; // Data to be included in the response
        this.message = message; // Message describing the response
        this.success = statusCode < 400; // Boolean indicating success based on the status code
    }
}

export {ApiResponse};
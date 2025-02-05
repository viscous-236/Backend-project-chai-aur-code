class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // HTTP status code for the error
        this.data = null; // Placeholder for any additional data related to the error
        this.message = message; // Error message
        this.errors = errors; // Array to hold multiple error details
        this.success = false; // Indicates the success status of the API response

        if (stack) {
            this.stack = stack; // If a stack trace is provided, use it
        } else {
            Error.captureStackTrace(this, this.constructor); // Otherwise, capture the current stack trace
        }
    }
}

export {ApiError}

// Stack trace is a list of the function calls that the application was in the middle of when an error occurred.
// Error.captureStackTrace() :- This method is used to create a stack trace for the error. It captures the current call stack and assigns it to the stack property of the error object. This is useful for custom error classes to ensure they have a stack trace similar to built-in errors.
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((error) => next(error))
    }
}

export {asyncHandler}


/* 
const asyncHandler = () => {}
const asyncHandler = (func) => () => {}
const asyncHandler = (func) => async () => {}
 */

// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         })
//     }
// }

/**
Explanation:
	1.	asyncHandler is a higher-order function:
	•	It takes another function (requestHandler) as an argument.
	•	This requestHandler is expected to be an asynchronous function (or a function that returns a Promise).
	2.	It returns a new function that acts as middleware:
	•	The returned function takes req (request), res (response), and next (next middleware function) as parameters.
	3.	Handling asynchronous errors:
	•	requestHandler(req, res, next) is executed inside Promise.resolve(), ensuring that both synchronous and asynchronous errors are handled uniformly.
	•	If requestHandler resolves successfully, nothing happens.
	•	If an error occurs (e.g., an unhandled rejection or throw inside requestHandler), the .catch(error => next(error)) ensures the error is passed to Express’s built-in error-handling middleware.

 */
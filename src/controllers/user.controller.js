import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiErrors.js';
import {User} from '../models/user.model.js';
import {uploadToCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    /*
    get the data from the user like name, email, password
    validation of the data
    check if the user already exists:username,email, if exists then send an error message
    check for images and check for avtar
    upload them to cloudnary, check for avtar
    if not then create a new user
    create a new user object - create entry in db
    reamove password and refresh token from the response
    check for user creation
    return res
     */

    const {username, email, fullname, password} = req.body
    console.log("email",email);

    // if(fullname === undefined || fullname === ""){
    //     throw new ApiError(400,"Fullname is reqiured")
    // }
    if (
        [fullname, email, password, username].some((field) => {
            return field?.trim() === ""
        })
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUserEmail = User.findOne({email});
    const existedUsername = User.findOne({username})
    if(existedUserEmail){
        throw new ApiError(409,"Email already exists")
    }
    if(existedUsername){
        throw new ApiError(409,"Username already exists")
    }

    // as we have declared the middleware in the route, we can access the req.files, its better to chain it optionally, we need its firest property as it gives an object with path property
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = uploadToCloudinary(avatarLocalPath);
    const coverImage = uploadToCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"avatar not uploaded");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully!")
    )
})

export {
    registerUser,
}

/*
alternate method to check for duplicate fields:
const existedUser = User.findOne({$or:[{email},{username}]})
*/
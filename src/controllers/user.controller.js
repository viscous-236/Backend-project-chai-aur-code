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
    if(password.length < 6){
        throw new ApiError(400,"Password must be atleast 6 characters long")
    }

    if (
        [fullname, email, password, username].some((field) => {
            console.log("field: ",field);
            return field?.trim() === ""
        })
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUserEmail = await User.findOne({email});
    const existedUsername = await User.findOne({username})
    if(existedUserEmail){
        throw new ApiError(409,"Email already exists")
    }
    if(existedUsername){
        throw new ApiError(409,"Username already exists")
    }

    // as we have declared the middleware in the route, we can access the req.files, its better to chain it optionally, we need its firest property as it gives an object with path property

    const avatarLocalPath = req.files?.avatar[0]?.path; 
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    console.log("req.files",req.files);
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    let coverImage;
    if(coverImageLocalPath){
        coverImage = await uploadToCloudinary(coverImageLocalPath);
    }


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
    console.log("createdUser",createdUser);
    

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
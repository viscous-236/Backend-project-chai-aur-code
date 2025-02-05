import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,//cloudinary URL
            required: true
        },
        coverImage: {
            type:String,//cloudinary URL
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        }
    },
    {timestamps: true})

userSchema.pre("save", async function(next) {
    if(isModified("password")){
        this.password =await  bcrypt.hash(this.password, 10)
        next();
    }else{
        return next();
    }
})

userSchema.methods.verifyPassowrd = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function()
{
    return await jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User =  mongoose.model("User", userSchema)

// when we write call back function in pre save, we need to use function keyword instead of arrow function
// because arrow function does not have its own this keyword, it does not have its own context

// encryption is a long process, so we need to use async function

// we need to use isModified method to check if the password is modified or not so this avoid the rehashing of the password whenever we update any user information

/*
Analogy: JWT as a Movie Ticket 🎟️

Imagine you’re watching a movie at a theater. When you buy a ticket:
	•	Access Token = Your Ticket 🎟️ (Short-lived, grants access to the movie)
	•	Refresh Token = VIP Pass 🏷️ (Longer-lived, lets you get a new ticket if needed)

If your ticket (Access Token) expires:
	1.	You go to the counter with your VIP Pass (Refresh Token).
	2.	The counter verifies it and gives you a new ticket (New Access Token).
	3.	You continue watching the movie without buying a new ticket.

Similarly, in authentication:
	•	Access Tokens grant access to protected routes (like API calls).
	•	Refresh Tokens are used to get new Access Tokens when they expire.
*/
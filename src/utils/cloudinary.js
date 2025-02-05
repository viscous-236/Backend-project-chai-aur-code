import cloudinary from 'cloudinary';
import fs from 'fs';

// Function to upload a file to Cloudinary
const uploadToCloudinary = async (localFilePath) => {
    try {
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect the file type (image, video, etc.)
        });
        
        // File uploaded successfully
        console.log("File uploaded successfully on Cloudinary", response);
        return response;
    } catch (error) {
        // If the upload fails, remove the locally temporarily saved file
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary", error);
        throw error;
    }
};

cloudinary.config({ 
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
    api_key: process.env.CLOUDNARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_API_SECRET 
});

export {uploadToCloudinary};
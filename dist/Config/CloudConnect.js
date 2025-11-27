"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinaryBuffer = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
});
const uploadToCloudinaryBuffer = async (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => {
            if (error)
                reject(error);
            else if (result)
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            else
                reject(new Error("Upload failed"));
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
};
exports.uploadToCloudinaryBuffer = uploadToCloudinaryBuffer;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=CloudConnect.js.map
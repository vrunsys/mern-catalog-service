import { v2 as cloudinary } from "cloudinary";
import "../config/cloudinary";

export class CloudService {
	async upload(file: Express.Multer.File): Promise<string> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "products" },
				(error, result) => {
					if (error || !result) {
						return reject(error ?? new Error("Cloudinary upload failed"));
					}
					resolve(result.secure_url);
				},
			);
			uploadStream.end(file.buffer);
		});
	}
}

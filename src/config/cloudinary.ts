import { v2 as cloudinary } from "cloudinary";
import config from "config";

cloudinary.config({
	cloud_name: config.get<string>("cloudinary.cloudName"),
	api_key: config.get<string>("cloudinary.apiKey"),
	api_secret: config.get<string>("cloudinary.apiSecret"),
});

export default cloudinary;

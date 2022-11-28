import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export default new S3Client({ region: process.env.S3_REGION });

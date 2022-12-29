import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export default new S3Client({
  region: process.env.FS_S3_REGION + "",
  credentials: {
    accessKeyId: process.env.FS_AWS_ACCESS_KEY_ID + "",
    secretAccessKey: process.env.FS_AWS_ACCESS_KEY_SECRET + "",
  },
});

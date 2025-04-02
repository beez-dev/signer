import 'dotenv/config'; // better to use nestjs's config module, dotenv for simplicity

export default {
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  region: process.env.S3_REGION,
  bucketName: process.env.BUCKET_NAME,
  adminEmail: process.env.ADMIN_EMAIL,
};

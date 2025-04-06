import 'dotenv/config'; // better to use nestjs's config module, dotenv for simplicity

export default {
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  region: process.env.S3_REGION,
  bucketName: process.env.BUCKET_NAME,
  adminEmail: process.env.ADMIN_EMAIL,
  dbConnectionString: `mongodb://${process.env.CLUSTER_USERNAME}:${process.env.CLUSTER_PWD}@${process.env.DB_URL}:${process.env.DB_PORT}?directConnection=true&serverSelectionTimeoutMS=20000&tlsAllowInvalidHostnames=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false&authMechanism=SCRAM-SHA-1`,
};

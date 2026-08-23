import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = 'ap-south-1';
const BUCKET_NAME = 'caliper-image';

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return new Response(
        JSON.stringify({ error: 'Missing fileName or fileType' }),
        { status: 400 }
      );
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: `${fileName}`,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return new Response(
      JSON.stringify({ uploadUrl, fileName: `${fileName}` }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

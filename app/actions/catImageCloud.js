'use server';

import axios from 'axios';

export async function catImageCloud(tag) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${tag}`;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const images = res.data.resources;

    if (images.length > 0) {
      // Return the first image's secure URL
      return images[0].secure_url;
    } else {
      return null; // No image found
    }
  } catch (error) {
    console.error('Error fetching image by tag:', error);
    return null;
  }
}

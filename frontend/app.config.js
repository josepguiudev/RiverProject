import 'dotenv/config';

export default {
  expo: {
    name: "RiverProject",
    slug: "riverproject",
    version: "1.0.0",
    extra: {
      BACKEND_URL: process.env.BACKEND_URL,
      STEAM_API_KEY: process.env.STEAM_API_KEY,
    },
  },
};
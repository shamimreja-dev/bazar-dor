import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI; 
if (!mongoUri) { throw new Error("MONGODB_URI is missing from environment variables"); }
 const client = new MongoClient(mongoUri);
  const db = client.db();
   export const auth = betterAuth({
     baseURL: process.env.BETTER_AUTH_URL,
     
      database: mongodbAdapter(db, { client }), trustedOrigins: [ "http://localhost:3000", "https://bazar-dor-pi.vercel.app", "https://bazar-2wr3n0gmu-shamim-reja232.vercel.app", ], emailAndPassword: { enabled: true, }, socialProviders: { google: 
    { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, 

    }, github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET, 

    }, 
  }, 
});
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { setServers } from "node:dns";
import { setServers as setPromiseServers } from "node:dns/promises";

if (process.env.NODE_ENV === "development") {
  const dnsServers = ["1.1.1.1", "8.8.8.8"];

  setServers(dnsServers);
  setPromiseServers(dnsServers);
}

const uri = process.env.MONGODB_URI;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!uri || !secret || !baseURL) {
  throw new Error("Auth environment variables are missing.");
}

const globalForMongo = globalThis as typeof globalThis & {
  bazardorMongoClient?: MongoClient;
};

const client =
  globalForMongo.bazardorMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.bazardorMongoClient = client;
}

const db = client.db(process.env.MONGODB_DB || "bazardor");

export const auth = betterAuth({
  appName: "BazarDor",
  baseURL,
  secret,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    scope: ["user:email"],
  },
},
});
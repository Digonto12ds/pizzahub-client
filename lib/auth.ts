import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.BETTER_AUTH_Db_URL as string)
const db = client.db("pizzahubDB")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },
  
 user: {
  additionalFields: {
    role: {
      type: ["customer", "vendor", "admin"],
      required: false,
      defaultValue: "customer",
      input: true,
    },
        subscriptionPlan: {
      type: "string",
      required: false,
      defaultValue: "free",
      input: false,
      returned: true,
    },

    // ADDED: Subscription Status
    subscriptionStatus: {
      type: "string",
      required: false,
      defaultValue: "inactive",
      input: false,
      returned: true,
    },
  },
},
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
})

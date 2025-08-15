export const APP_TOKEN = process.env["NODE_ENV"] === "production"
  ? process.env["PROD_TOKEN"]
  : process.env["DEV_TOKEN"];

export const APP_ID = process.env["NODE_ENV"] === "production"
  ? process.env["PROD_APP_ID"]
  : process.env["DEV_APP_ID"];

export const DB_URI = process.env["NODE_ENV"] === "production"
  ? process.env["PROD_URI"]
  : process.env["DEV_URI"];




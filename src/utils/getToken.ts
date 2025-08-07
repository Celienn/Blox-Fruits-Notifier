export default function () {
  return process.env["NODE_ENV"] === "production"
    ? process.env["PROD_TOKEN"]
    : process.env["DEV_TOKEN"];
};
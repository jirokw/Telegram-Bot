require("dotenv").config();
const { fileURLToPath } = require("url");
const fs = require("fs");

module.exports = {
  owner: "arifzxa19",
  token: process.env.TOKEN || "",

  APIs: {
    arifzyn: "https://api.arifzyn.biz.id",
  },

  APIKeys: {
    "https://api.arifzyn.biz.id": process.env.APIKEY || "",
  },

  msg: {
    error: "Internal Server Eror.",
    owner: "Sorry, this command can only be accessed by the owner!",
    group: "Sorry, this command can only be used within a group!",
    wait: "Your request is being processed...",
  },
};

let fileP = require.resolve(__filename);
fs.watchFile(fileP, () => {
  fs.unwatchFile(fileP);
  console.log(`[ UPDATE ] file => "${fileP}"`);
  delete require.cache[fileP];
  require(`${fileP}?update=${Date.now()}`);
});

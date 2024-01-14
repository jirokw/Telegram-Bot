require("dotenv").config();
const { fileURLToPath } = require("url");
const fs = require("fs");

module.exports = {
  owner: "JIROSTOREOFC",
  token: process.env.TOKEN || "6676039314:AAHtRy9nKdtc9GGTZly7M8yDttTQmOB0A8s",

  APIs: {
    arifzyn: "https://api.arifzyn.biz.id",
  },

  APIKeys: {
    "https://api.arifzyn.biz.id": process.env.APIKEY || "AR-zH0qfwCl3cDc",
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

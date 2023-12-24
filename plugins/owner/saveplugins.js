const fs = require("fs");
const path = require("path");

module.exports = {
  command: ["addplugins", "saveplugins", "sp"],
  help: ["saveplugins"],
  tags: ["owner"],
  run: async (bot, { msg }) => {
    if (!msg.quoted?.text) return msg.sendReply("Reply pesan code");
    let dir = text.includes(".js") ? text : `plugins/${text}.js`;
    await fs.writeFileSync(dir, quoted.body);
    msg.sendReply(`tersimpan di '${dir}'`);
  },
  owner: true,
  use: "Path Folder command?",
};

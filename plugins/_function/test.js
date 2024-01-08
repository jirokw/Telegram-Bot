const similarity = require("similarity");

const threshold = 0.72;

module.exports = async (bot, { msg }) => {
  global.tebakgambar = global.tebakgambar ? global.tebakgambar : {};
  let id = msg.chat.id;
  let user = db.users[msg.sender];

  if (!(id in global.tebakgambar)) return;

  if (msg.quoted.message_id == global.tebakgambar[id][0].message_id) {
    let json = JSON.parse(JSON.stringify(global.tebakgambar[id][1]));
    if (msg.message.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      user.limit = global.tebakgambar[id][2];
      msg.sendReply(`*Benar!* 🎉\n\n+${global.tebakgambar[id][2]} limit`);
      clearTimeout(global.tebakgambar[id][3]);
      delete global.tebakgambar[id];
    } else if (
      similarity(
        msg.message.text.toLowerCase(),
        json.jawaban.toLowerCase().trim(),
      ) >= threshold
    )
      msg.sendReply(`Dikit Lagi!`);
    else msg.sendReply(`Salah lol`);
  }
  return !0;
};

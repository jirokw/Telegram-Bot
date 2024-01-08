let timeout = 120000;
let poin = 3;

module.exports = {
  command: ["tebakgambar"],
  tags: ["game"],
  help: ["tebakgambar"],
  run: async (bot, { msg }) => {
    global.tebakgambar = global.tebakgambar ? global.tebakgambar : {};

    let id = msg.chat.id;

    if (id in global.tebakgambar) {
      msg.reply("Masih ada soal belum terjawab di chat ini", {
        reply_to_message_id: global.tebakgambar[id][0].message_id,
      });
      return false;
    }

    let json = await Func.fetchJson(
      "https://raw.githubusercontent.com/ArifzynXD/database/master/games/tebakgambar.json",
    );
    json = json[Math.floor(Math.random() * json.length)];

    let caption = `  
🎮 *Tebak Gambar* 🎮

${json.deskripsi}

⭔ Timeout *${(timeout / 1000).toFixed(2)} detik*
⭔ Bonus: ${poin} Limit

Reply pesan ini untuk menjawab.
`.trim();
    global.tebakgambar[id] = [
      await msg.replyWithPhoto(json.img, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Help", callback_data: "tebakgambar_help" },
              { text: "Anwer", callback_data: "tebakgambar_ans" },
            ],
          ],
        },
        reply_to_message_id: msg.message.message_id,
      }),
      json,
      poin,
      setTimeout(() => {
        if (global.tebakgambar[id])
          msg.reply(`Waktu habis!\nJawabannya adalah *${json.jawaban}*`, {
            reply_to_message_id: global.tebakgambar[id][0].message_id,
          });
        delete global.tebakgambar[id];
      }, timeout),
    ];

    bot.on("callback_query", async (ctx) => {
      const action = ctx.callbackQuery.data;

      switch (action) {
        case "tebakgambar_help":
          await ctx.editMessageCaption(caption, {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Anwer", callback_data: "tebakgambar_ans" }],
              ],
              reply_to_message_id: msg.message.message_id,
            },
          });
          await msg.sendReply(
            "Cara Main Tebak Gambar\n\n1. Reply pesan pertanyaan di atas\n2. Isi jawaban yang menurut kamu benar\n3. Menjawab soal tidak boleh lebih dari 120 detik; jika lebih, pertanyaan dianggap habis.",
          );
          break;
        case "info":
          ctx.editMessageText("....");
          break;
      }
    });
  },
};

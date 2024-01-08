const { performance } = require("perf_hooks");
const os = require("os");

module.exports = {
  command: ["ping"],
  tags: ["info"],
  help: ["ping"],
  run: async (bot, { msg }) => {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "runtime", callback_data: "runtime" }
          ],
        ],
      },
    };

    const old = performance.now();
    const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const free_ram = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";
    const serverInfo = `\`Server Information\`

\`- ${os.cpus().length} CPU: ${os.cpus()[0].model}\`

\`- Uptime: ${Math.floor(os.uptime() / 86400)} days\`
\`- Ram: ${free_ram}/${ram}\`
\`- Speed: ${(performance.now() - old).toFixed(5)} ms\``;

    msg.sendReply(serverInfo, keyboard);

    bot.on("callback_query", async (ctx) => {
      const action = ctx.callbackQuery.data;
      switch (action) {
        case "runtime":
          ctx.editMessageText(runtime(process.uptime()));
          break;
        case "info":
          ctx.editMessageText("...");
          break;
      }
    });
  },
};

function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }
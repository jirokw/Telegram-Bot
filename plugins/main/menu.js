const tags = {
  ai: "AI FEATURE",
  download: "DOWNLOAD FEATURE",
  owner: "OWNER FEATURE",
  info: "INFO FEATURE",
  game: "GAME FEATURE",
};

module.exports = {
  command: ["menu"],
  help: ["menu"],
  tags: ["info"],
  run: async (bot, { msg }) => {
    const Start = new Date();

    const now = new Date();
    const uptimeMilliseconds = now - Start;
    const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);

    let menuText = `Hi ${msg.from.username}\nI am an automated system (Telegram Bot) which will help you every day.\n\n`;
    menuText += `┌  ◦ Uptime: ${uptimeHours} hours ${
      uptimeMinutes % 60
    } minutes ${uptimeSeconds % 60} seconds\n`;
    menuText += `│  ◦ Library: Telegraf\n`;
    menuText += `│  ◦ Hari: ${getDayName(now.getDay())}\n`;
    menuText += `│  ◦ Waktu: ${now.toLocaleTimeString()}\n`;
    menuText += `│  ◦ Tanggal: ${now.toLocaleDateString()}\n`;
    menuText += "│  ◦ Version: 1.0.4\n";
    menuText += "└\n\n";

    const help = Array.from(plugins.values()).map((plugin) => {
      return {
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      };
    });

    for (let plugin of help)
      if (plugin && "tags" in plugin)
        for (let tag of plugin.tags) if (!(tag in tags) && tag) tags[tag] = tag;
    Object.keys(tags).map((tag) => {
      menuText += `╭─「 ${tags[tag]}\n`;
      help
        .filter((menu) => menu.tags && menu.tags.includes(tag) && menu.help)
        .map((menu) => {
          menu.help.map((help) => {
            menuText += `│ • ${help ? help : ""}\n`;
          });
        });
      menuText += "╰─\n\n";
    });

    menuText += `Powered By © <a href="https://api.arifzyn.biz.id">Arifzyn API</a>`;

    await msg.replyWithPhoto(
      "https://hostfile.my.id/file/1f85dd62dfbca17b19b1d.jpg",
      {
        caption: menuText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Source Feature", url: "https://api.arifzyn.biz.id" }],
          ],
        },
        reply_to_message_id: msg.message.message_id,
      },
    );
  },
};

function getDayName(dayIndex) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayIndex];
}

process.on("uncaughtException", console.error);

const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const syntaxerror = require("syntax-error");
const { format } = require("util");
const chokidar = require("chokidar");

const config = require("./config");
const database = new (require("./lib/localdb"))();
const { Collection, watchPlugins } = require("./lib/plugins.js");
	
const bot = new Telegraf(config.token);

global.axios = require("axios");
global.cheerio = require("cheerio");
global.fetch = require("node-fetch");
global.config = config
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in config.APIs ? config.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: config.APIKeys[name in config.APIs ? config.APIs[name] : name] } : {}) })) : '')
global.Func = new (require("./lib/function"))()
global.plugins = new Collection();


const pluginsFolder = "plugins"; 
const dir = fs.readdirSync(pluginsFolder).filter((a) => a !== "_function")
for (const pluginFolder of dir) {
  const pluginPath = `${pluginsFolder}/${pluginFolder}`;

  if (fs.statSync(pluginPath).isDirectory()) {
    const files = fs
      .readdirSync(pluginPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      try {
        const fullPath = `${pluginPath}/${file}`;
        const module = require(`../${fullPath}`);
        if (!module.tags) return;
        plugins.set(fullPath, module);
        console.log(`Plugin loaded: ${fullPath}`);
      } catch (e) {
        console.error(`Error loading plugin: ${e.message}`);
      }
    }
  }
}

database.connect().catch(() => database.connect());
setInterval(async () => {
  fs.writeFileSync(
    `system/temp/database.json`,
    JSON.stringify(global.db, null, 3),
  );
}, 3 * 1000);

bot.command('start', (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.url('Visit our website', 'http://www.example.com'),
    Markup.button.callback('Say Hello', 'HELLO'),
  ]);

  ctx.reply('Welcome!', { reply_markup: keyboard });
});

bot.on("message", (msg) => {
  const body = msg.message.text || msg.message.caption || "";
  const prefix = /^[°•π÷×¶∆£¢€¥®™+✓_|~!?@#%^&.©^]/gi.test(body)
    ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_|~!?@#%^&.©^]/gi)[0]
    : "";
  const cmd =
    body && body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
  const plugin =
    plugins.get(cmd) ||
    plugins.find((v) => v.command && v.command.includes(cmd));

  const args =
    body
      .trim()
      .replace(new RegExp(prefix, "i"), "")
      .replace(cmd, "")
      .split(/ +/)
      .filter((a) => a) || [];
  const text = args.join(" ");
  const isOwner = config.owner.includes(msg.message.from.username);
  const isGroup = msg.message.chat.type.includes("group");

  msg.args = args 
  msg.text = text
  msg.sender = msg.message.from.id;
  msg.isOwner = isOwner;
  msg.isGroup = isGroup;
  msg.chat = msg.message.chat.id;
  msg.quoted = msg.message.reply_to_message
    ? msg.message.reply_to_message
    : msg.message;
  msg.sendReply = (teks, options = {}) => {
    return msg.reply(teks, {
      reply_to_message_id: msg.message.message_id,
      ...options,
    });
  };
  msg.editMessage = (id, teks, mess) => {
    return bot.telegram.editMessageText(id, mess.message_id, null, teks);
  };
  msg.download = async (quoted) => {
  	const id = await Func.getFileId(quoted)
  	const { href } = await bot.telegram.getFileLink(id)
  	return href
  }

  if (body) {
    require("./lib/database").idb(msg);
  }
  
  if (plugin) {	
    if (!prefix && plugin.noPrefix) {
      if (plugin.owner && !isOwner) {
        return msg.sendReply(config.msg.owner);
      }
      if (plugin.group && !isGroup) {
        return msg.sendReply(config.msg.group);
      }
      if (plugin.use && !text) {
      	return msg.sendReply(plugin.use.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd).replace(/%text/gi, text));
      }

      plugin.run(bot, {
        msg,
        args,
        text,
        command: cmd,
      });
    }
    if (!!prefix && body.startsWith(prefix)) {
      if (plugin.owner && !isOwner) {
        return msg.reply(config.msg.owner);
      }
      if (plugin.group && !isGroup) {
        return msg.reply(config.msg.group);
      }
      if (plugin.use && !text) {
      	return msg.sendReply(plugin.use.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd).replace(/%text/gi, text));
      }

      plugin.run(bot, {
        msg,
        args,
        text,
        command: cmd,
      });
      console.log("command :", cmd);
    }
  }
  
  if (!plugin) {
  	const dir = "plugins/_function";
  	const files = fs.readdirSync(dir).filter((file) => file.endsWith(".js"));
  	if (files.length === 0) return;
  	for (const file of files) {
  		const load = require(`../${dir}/${file}`)
  		load(bot, {
  			msg,
  			args,
  			text,
  			command: cmd,
         });
  	}
  }
});
 
bot.launch();

watchPlugins(pluginsFolder);
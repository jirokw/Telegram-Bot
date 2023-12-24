const yts = require("yt-search");
const ytdl = require("ytdl-core");

let currentVideoTitle;

module.exports = {
  command: ["play"],
  help: ["play"],
  tags: ["download"],
  run: async (bot, { msg: ctx, args }) => {
    if (!args[0]) {
      ctx.sendReply("Masukan Query!\n\nContoh:\n.play <judul lagu>");
      return;
    }

    try {
      const query = args.join(" ");

      const { videos } = await yts(query);

      if (videos.length === 0) {
        ctx.sendReply(`Tidak dapat menemukan video untuk query "${query}".`);
        return;
      }

      const video = videos[0];
      const videoTitle = video.title;
      currentVideoTitle = videoTitle
      const videoId = video.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const infoMessage = `[ YouTube Play ]
      
🎶 Title: ${videoTitle}      
⏱️ Duration: ${video.duration.timestamp} ⏱️
👁️ Views: ${video.views} person
🧑‍🎤 Uploader: [${video.author.name}]
🔗 URL: ${videoUrl} 
      `;

      ctx.replyWithPhoto(video.thumbnail, {
        caption: infoMessage,	
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Unduh Audio 🎵",
                callback_data: `download-audio:${videoId}`,
              },
              {
                text: "Unduh Video 📹",
                callback_data: `download-video:${videoId}`,
              },
            ],
          ],
        },
        reply_to_message_id: ctx.message.message_id,
      });
    } catch (error) {
      console.error(error);
      ctx.sendReply(config.msg.error)
    }
  },

  onCallback: async (bot, { ctx, match }) => {
    const [action, videoId] = match[0].split(":");

    const chatId = ctx.update.callback_query.message.chat.id;
    const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    
    switch (action) {
      case "download-audio":
        await ctx.editMessageCaption(config.msg.wait)
        const audioStream = await ytdl(
          `https://www.youtube.com/watch?v=${videoId}`,
          { filter: "audioonly" },
        );
        
        await bot.telegram.sendAudio(chatId, { source: audioStream, filename: `${videoInfo.videoDetails.title}.mp3` });
        break;

      case "download-video":
        await ctx.editMessageCaption(config.msg.wait)
        const format = ytdl.chooseFormat(videoInfo.formats, { quality: 'lowest' });
        const videoStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { format: format });
        const thumbnailUrl = videoInfo.videoDetails.thumbnails[0].url;

        await bot.telegram.sendVideo(chatId, { source: videoStream, thumb: thumbnailUrl });
        break;

      default:
        break;
    }
  },
};

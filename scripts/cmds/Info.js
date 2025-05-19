const moment = require('moment-timezone');
const axios = require('axios');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf", "in4"],
    version: "3.5",
    author: "Anthony | Edited by SAIM",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Sends information about the bot and admin along with a video."
    },
    longDescription: {
      en: "Sends information about the bot and admin along with a video."
    },
    category: "Information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    this.sendInfo(message);
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.sendInfo(message);
    }
  },

  sendInfo: async function (message) {
    const botName = "꧁ 𝓝𝓸𝓫𝓲𝓽𝓪 ☁️💬 ꧂";
    const botFullName = "⚙️ 𝙽𝙾𝙱𝙸𝚃𝙰 𝙲𝙷𝙰𝚃 𝙱𝙾𝚃 ⚙️";
    const authorName = "S A I M";
    const authorFB = "Ew'r Saim";
    const whatsapp = "📱 01729537588";
    const telegram = "✈️ @saimx69x";
    const mood = "💔 Sad";
    const status = "༆ Single ༆";

    const now = moment().tz('Asia/Dhaka');
    const time = now.format('h:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    const videoUrl = "https://files.catbox.moe/hvbsb6.mp4";

    const body = `
╔═━「 ☄️ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 ☄️ 」━═╗
┃
┃ 🧑‍💼 𝗔𝗗𝗠𝗜𝗡 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
┃ ━━━━━━━━━━━━━━━
┃ ✦ 𝗡𝗮𝗺𝗲: ${authorName}
┃ ✦ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: ${authorFB}
┃ ✦ 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: ${whatsapp}
┃ ✦ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: ${telegram}
┃ ✦ 𝗠𝗼𝗼𝗱: ${mood}
┃ ✦ 𝗦𝘁𝗮𝘁𝘂𝘀: ${status}
┃
┃ 🤖 𝗕𝗢𝗧 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
┃ ━━━━━━━━━━━━━━━
┃ ✦ 𝗡𝗮𝗺𝗲: ${botName}
┃ ✦ 𝗧𝗶𝗺𝗲 (BD): 🕒 ${time}
┃ ✦ 𝗨𝗽𝘁𝗶𝗺𝗲: ⏱️ ${uptimeString}
┃
╚═━「 ${botFullName} 」━═╝

╭─────『 ✨ 𝘊𝘩𝘢𝘵 𝘞𝘪𝘵𝘩 𝘏𝘦𝘢𝘳𝘵 ✨ 』─────╮
│ ❝ I'm not perfect...
│    But I'm always here —  
│    to listen, to reply,  
│    and to stay when no one else does. ❞
│
│   𝗪𝗶𝘁𝗵 𝗹𝗼𝘃𝗲,  
│   🤖 Nobita Chat Bot
╰──────────────────────────────╯
`;

    try {
      const response = await axios.get(videoUrl, { responseType: 'stream' });

      setTimeout(() => {
        message.reply({
          body,
          attachment: response.data
        });
      }, 5000); // 5 seconds delay
    } catch (err) {
      message.reply("⚠️ Video load korte problem hoise. Please try again pore.");
    }
  }
};

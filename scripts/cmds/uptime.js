const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "goatuptime"],
    version: "4.1",
    author: "S A I M",
    role: 0,
    shortDescription: {
      en: "GOAT-style uptime with image and signature"
    },
    longDescription: {
      en: "Displays uptime in a boss-level style with image and owner signature."
    },
    category: "system",
    guide: {
      en: "{p}uptime"
    }
  },

  onStart: async function ({ api, event }) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / 3600) % 24);
    const days = Math.floor(uptime / (3600 * 24));

    const msg = `
⚡👑 𝗚𝗢𝗔𝗧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗘𝗣𝗢𝗥𝗧 👑⚡

⏱ Days   : ${days}
⏱ Hours  : ${hours}
⏱ Mins   : ${minutes}
⏱ Secs   : ${seconds}

🔥 STATUS: UNSTOPPABLE
💀 Downtime? NEVER HEARD OF IT.

───────────────

───────────────`;

    // Using the same image as help command
    const imageUrl = "https://files.catbox.moe/9f7p0a.jpg";
    const imagePath = path.join(__dirname, "uptime_goat.jpg");

    const response = await axios.get(imageUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath));
    });

    writer.on("error", (err) => {
      console.error("Image download failed:", err);
      api.sendMessage(msg, event.threadID);
    });
  }
};

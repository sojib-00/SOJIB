const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "waifu",
    aliases: ["animegirl", "bestgirl"],
    version: "1.0",
    author: "Saim / owner Saim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Random anime waifu pathao"
    },
    longDescription: {
      en: "Ekta cute anime waifu er image user ke pathay"
    },
    category: "FUN",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    const cachePath = path.join(__dirname, 'cache');
    const fileName = `waifu_${Date.now()}.jpg`;
    const filePath = path.join(cachePath, fileName);

    try {
      await fs.ensureDir(cachePath);

      // Waifu image er ekta link ney
      const waifuAPI = await axios.get("https://api.waifu.pics/sfw/waifu");
      const imageUrl = waifuAPI.data.url;

      // Image ta download kore
      const imageData = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, imageData.data);

      // Stylish text
      const stylishText = `
✨ 𝒀𝒐𝒖𝒓 𝒓𝒂𝒏𝒅𝒐𝒎 𝒂𝒏𝒊𝒎𝒆 𝒘𝒂𝒊𝒇𝒖 𝒊𝒔 𝒉𝒆𝒓𝒆! ✨

~ ᴏᴡɴᴇʀ Sᴀɪᴍ`;

      api.sendMessage({
        body: stylishText,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);

    } catch (error) {
      console.error("Waifu command e problem:", error);
      api.sendMessage("Sorry, waifu pathate parchi na ekhon.", threadID, messageID);
    }
  }
};

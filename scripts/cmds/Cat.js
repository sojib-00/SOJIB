const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "cat",
    aliases: ["kitten", "meow"],
    version: "1.3",
    author: "Saim / owner Saim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Random cat image pathao"
    },
    longDescription: {
      en: "Ekta cute random cat er image user ke pathay"
    },
    category: "FUN",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    const cachePath = path.join(__dirname, 'cache');
    const fileName = `cat_${Date.now()}.jpg`;
    const filePath = path.join(cachePath, fileName);

    try {
      // Cache folder ta thakle bhalo, na thakle banabe
      await fs.ensureDir(cachePath);

      // Cat image er ekta random link ney
      const catAPI = await axios.get("https://api.thecatapi.com/v1/images/search");
      const imageUrl = catAPI.data[0].url;

      // Image ta download kore
      const imageData = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, imageData.data);

      // Stylish font diye text
      const stylishText = `
🌟 𝑻𝒐𝒎𝒂𝒓 𝒋𝒐𝒏𝒐 𝒆𝒌𝒕𝒂 𝒄𝓾𝓽𝒆 𝒄𝒶𝓉 𝒾𝓂𝒶𝑔𝑒! 🐱🌟

💫 ~ ᴏᴡɴᴇʀ Sᴀɪᴍ 💫`;

      // Image user ke pathay
      api.sendMessage({
        body: stylishText,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);

    } catch (error) {
      console.error("Cat command e problem:", error);
      api.sendMessage("Sorry, ekhon cat image pathate parchi na.", threadID, messageID);
    }
  }
};

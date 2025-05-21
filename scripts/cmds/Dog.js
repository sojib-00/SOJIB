const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "dog",
    aliases: ["puppy", "bark"],
    version: "1.0",
    author: "Saim / owner Saim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Random dog image pathao"
    },
    longDescription: {
      en: "Ekta cute random dog er image user ke pathay"
    },
    category: "FUN",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    const cachePath = path.join(__dirname, 'cache');
    const fileName = `dog_${Date.now()}.jpg`;
    const filePath = path.join(cachePath, fileName);

    try {
      // Cache folder check + create
      await fs.ensureDir(cachePath);

      // Dog image er ekta random link ney
      const dogAPI = await axios.get("https://dog.ceo/api/breeds/image/random");
      const imageUrl = dogAPI.data.message;

      // Image ta download kore
      const imageData = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, imageData.data);

      // Stylish font diye text
      const stylishText = `
🐶 𝑬𝒌𝒕𝒂 𝒄𝓾𝓽𝒆 𝒅𝓸𝓰 𝒕𝓸𝒎𝒂𝒓 𝒋𝒐𝒏𝒏𝒐! 🦴

~ ᴏᴡɴᴇʀ Sᴀɪᴍ`;

      // Image user ke pathay
      api.sendMessage({
        body: stylishText,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);

    } catch (error) {
      console.error("Dog command e problem:", error);
      api.sendMessage("Sorry, ekhon dog image pathate parchi na.", threadID, messageID);
    }
  }
};

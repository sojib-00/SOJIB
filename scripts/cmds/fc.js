const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "fc", // Command use hobe /fc cat, /fc dog, etc.
    version: "1.0",
    author: "ChatGPT + Saim",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Send random fun images like cat, dog, etc." },
    longDescription: { en: "Use `/fc` with type to get a random image. Example: /fc cat" },
    category: "fun",
    guide: {
      en: "/fc [cat | dog | panda | fox | duck | redpanda | bird | koala | bunny | meme | waifu | hug | kiss | wink]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const cachePath = path.join(__dirname, 'cache');
    await fs.ensureDir(cachePath);

    const type = args[0]?.toLowerCase();
    const validTypes = {
      cat: { url: "https://api.thecatapi.com/v1/images/search", key: "url" },
      dog: { url: "https://dog.ceo/api/breeds/image/random", key: "message" },
      fox: { url: "https://randomfox.ca/floof/", key: "image" },
      panda: { url: "https://some-random-api.ml/img/panda", key: "link" },
      bird: { url: "https://some-random-api.ml/img/birb", key: "link" },
      koala: { url: "https://some-random-api.ml/img/koala", key: "link" },
      redpanda: { url: "https://some-random-api.ml/img/red_panda", key: "link" },
      duck: { url: "https://random-d.uk/api/v2/random", key: "url" },
      bunny: { url: "https://some-random-api.ml/img/bunny", key: "link" },
      meme: { url: "https://meme-api.com/gimme", key: "url" },
      waifu: { url: "https://api.waifu.pics/sfw/waifu", key: "url" },
      hug: { url: "https://api.waifu.pics/sfw/hug", key: "url" },
      kiss: { url: "https://api.waifu.pics/sfw/kiss", key: "url" },
      wink: { url: "https://api.waifu.pics/sfw/wink", key: "url" }
    };

    if (!type || !validTypes[type]) {
      const typeList = Object.keys(validTypes).join(", ");
      return api.sendMessage(`Please use a valid type:\n/fc [ ${typeList} ]`, threadID, messageID);
    }

    try {
      const { url, key } = validTypes[type];
      const res = await axios.get(url);
      const imageUrl = Array.isArray(res.data) ? res.data[0][key] : res.data[key];

      const ext = path.extname(imageUrl).split("?")[0] || ".jpg";
      const fileName = `${type}_${Date.now()}${ext}`;
      const filePath = path.join(cachePath, fileName);

      const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, imageRes.data);

      const message = `
🌟 𝑻𝒐𝒎𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒆𝒌𝒕𝒂 𝒄𝒖𝒕𝒆 ${type} 𝒊𝒎𝒂𝒈𝒆! 🌟

💫 ~ ᴏᴡɴᴇʀ Sᴀɪᴍ 💫`;

      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("Sorry, image pathate problem holo.", threadID, messageID);
    }
  }
};

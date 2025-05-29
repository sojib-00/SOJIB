const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pin",
    version: "1.0",
    author: "MAHBUB SHAON (Modified for GoatBot by ChatGPT)",
    countDown: 5,
    role: 0,
    shortDescription: "Search image from Pinterest",
    longDescription: "Search and get images from Pinterest using keywords",
    category: "image",
    guide: "{pn} keyword-number\nExample: {pn} cat-5"
  },

  onStart: async function ({ api, event, args }) {
    const keySearch = args.join(" ");
    if (!keySearch.includes("-")) {
      return api.sendMessage(
        "❌ Incorrect format.\nUse this: keyword-number\nExample: pin cat-5",
        event.threadID
      );
    }

    const keyword = keySearch.slice(0, keySearch.indexOf("-")).trim();
    const amount = parseInt(keySearch.split("-").pop()) || 6;

    try {
      const apiUrl = "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json";
      const getApi = await axios.get(apiUrl);
      const apiLink = getApi.data.api;

      const res = await axios.get(`${apiLink}/pinterest?search=${encodeURIComponent(keyword)}`);
      const imageLinks = res.data.data;

      if (!Array.isArray(imageLinks) || imageLinks.length === 0) {
        return api.sendMessage("❌ No images found.", event.threadID);
      }

      const attachments = [];

      for (let i = 0; i < Math.min(amount, imageLinks.length); i++) {
        const path = __dirname + `/cache/pin_${i}.jpg`;
        const image = (await axios.get(imageLinks[i], { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, image);
        attachments.push(fs.createReadStream(path));
      }

      api.sendMessage(
        {
          body: `🔎 Here's your result for: "${keyword}" (${amount} images)`,
          attachment: attachments
        },
        event.threadID,
        async () => {
          // Delete cached images after sending
          for (let i = 0; i < attachments.length; i++) {
            fs.unlinkSync(__dirname + `/cache/pin_${i}.jpg`);
          }
        }
      );

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching image data.", event.threadID);
    }
  }
};

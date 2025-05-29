const axios = require("axios");

module.exports = {
  config: {
    name: "flux",
    version: "2.0",
    author: "Dipto",
    role: 0, // 0 = all users, 1 = admin only
    shortDescription: {
      en: "Generate AI images"
    },
    longDescription: {
      en: "Generate AI images from text prompts using Flux API by Dipto"
    },
    category: "image generator",
    guide: {
      en: "{pn} [prompt] --ratio 1024x1024\nExample: {pn} cat wearing sunglasses --ratio 1:1"
    },
    countDown: 15
  },

  onStart: async function ({ api, event, args }) {
    const dipto = "https://www.noobs-api.rf.gd/dipto";

    if (!args[0]) {
      return api.sendMessage("❌ Please provide a prompt.\nExample: flux cat in space --ratio 16:9", event.threadID, event.messageID);
    }

    try {
      const input = args.join(" ");
      const [prompt, ratio = "1:1"] = input.includes("--ratio")
        ? input.split("--ratio").map(s => s.trim())
        : [input, "1:1"];

      const loading = await api.sendMessage("🌀 Generating your image, please wait...", event.threadID);
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const apiurl = `${dipto}/flux?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`;
      const response = await axios.get(apiurl, { responseType: "stream" });

      const imageMsg = {
        body: `✅ Done!\n📝 Prompt: ${prompt}\n📐 Ratio: ${ratio}`,
        attachment: response.data
      };

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.unsendMessage(loading.messageID);

      return api.sendMessage(imageMsg, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ Failed to generate image.\nTry again later or check your prompt.", event.threadID, event.messageID);
    }
  }
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "create",
    aliases: [],
    version: "1.0",
    author: "Islamick Chat",
    countDown: 2,
    role: 0,
    shortDescription: "Generate AI image",
    longDescription: "Use prompt to generate AI image from pollinations.ai",
    category: "image generator",
    guide: {
      vi: "[prompt]",
      en: "[prompt]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const prompt = args.join(" ");
    const imagePath = path.join(__dirname, "cache", "ai_image.png");

    if (!prompt) {
      return message.reply("📌 Use format: create <your prompt>\n🖼️ Example: create a futuristic city with flying cars");
    }

    try {
      const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(imagePath, Buffer.from(response.data, "utf-8"));

      await message.send({
        body: "✅ Your AI image has been successfully created!",
        attachment: fs.createReadStream(imagePath)
      });

      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error(err);
      message.reply("❌ Image generate korte somossa hoise. Try again later.");
    }
  }
};

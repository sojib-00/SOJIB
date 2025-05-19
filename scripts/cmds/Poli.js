const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Random styles to add variation
const styles = [
  "cyberpunk style", "vaporwave background", "digital art", "oil painting",
  "watercolor effect", "futuristic lighting", "neon glow", "surreal", "Van Gogh style",
  "retro comic style", "dark fantasy", "low poly render"
];

module.exports = {
  config: {
    name: "poli",
    aliases: ['polination'],
    version: "1.4",
    author: "saim",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: 'Generate 4 unique AI images'
    },
    longDescription: {
      en: "Get 4 visually different images from Pollinations using prompt variation"
    },
    category: "IMAGE",
    guide: "{pn} your prompt",
  },

  onStart: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const basePrompt = args.join(" ");

    if (!basePrompt) return api.sendMessage("put text/query", threadID, messageID);

    const dir = path.join(__dirname, "cache");
    fs.ensureDirSync(dir);

    const imagePaths = [];

    try {
      for (let i = 0; i < 4; i++) {
        // Add random style to the prompt for uniqueness
        const style = styles[Math.floor(Math.random() * styles.length)];
        const finalPrompt = `${basePrompt}, ${style}`;

        const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}`, {
          responseType: "arraybuffer"
        });

        const filePath = path.join(dir, `poli_${i}.png`);
        fs.writeFileSync(filePath, response.data);
        imagePaths.push(filePath);
      }

      const attachments = imagePaths.map(file => fs.createReadStream(file));

      // Stylish message with symbols (Option 3)
      api.sendMessage({
        body: "🖼️ Here are 4 unique images! 🌟 Auto-deleted after 1 hour. ⏰",
        attachment: attachments
      }, threadID, () => {
        setTimeout(() => {
          imagePaths.forEach(file => {
            fs.unlink(file, err => {
              if (err) console.error("Delete error:", err);
            });
          });
        }, 3600000);
      }, messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Image generate korte somossa hoyeche.", threadID, messageID);
    }
  },
};

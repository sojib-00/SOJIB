const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "sdxl",
  version: "1.0",
  role: 0,
  author: "xrotick🥀",
  description: "Generate an AI image using SDXL Lightning API",
  category: "image generator",
  guide: "{pn} [prompt]\nExample: {pn} a futuristic city in the clouds",
  countDown: 10
};

module.exports.onStart = async ({ event, args, api }) => {
  const prompt = args.join(" ");
  const apiUrl = "https://zaikyoov3.koyeb.app/api/sdxl-lightning";

  if (!prompt) {
    return api.sendMessage("Please provide a prompt.\nExample: sdxl a cat astronaut", event.threadID, event.messageID);
  }

  const fullPrompt = `8k quality, ${prompt}`;
  const imageUrl = `${apiUrl}?prompt=${encodeURIComponent(fullPrompt)}`;

  try {
    const wait = await api.sendMessage("Generating image, please wait...", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream"
    });

    const imgPath = path.join(__dirname, "cache", `sdxl_${Date.now()}.png`);
    const writer = fs.createWriteStream(imgPath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `Here is your AI-generated image for: "${prompt}"`,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath));

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.unsendMessage(wait.messageID);
    });

    writer.on("error", err => {
      throw new Error("Failed to save the image stream");
    });

  } catch (err) {
    console.error("Image generation error:", err);
    api.sendMessage(`Failed to generate image: ${err.message}`, event.threadID, event.messageID);
  }
}; 

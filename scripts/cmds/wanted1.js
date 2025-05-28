const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "wanted",
    aliases: ["chorgang"],
    version: "1.1",
    author: "AceGun (Fixed by ChatGPT)",
    countDown: 5,
    role: 0,
    shortDescription: "Create a wanted frame with tagged friends",
    longDescription: "Generate a fun wanted poster with your profile and two friends",
    category: "fun",
    guide: "{pn}wanted @tag @tag"
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length < 2) {
      return message.reply("Please tag two friends to create the wanted poster.");
    }

    // Add the sender as third person
    mention.push(event.senderID);

    let [one, two, three] = mention;

    try {
      const imagePath = await createWantedImage(one, two, three);
      await message.reply({
        body: "These folks are now WANTED!",
        attachment: fs.createReadStream(imagePath)
      });
      fs.unlinkSync(imagePath); // delete image after sending
    } catch (error) {
      console.error("Error in wanted command:", error);
      message.reply("An error occurred while creating the image.");
    }
  }
};

// Generate image with Jimp
async function createWantedImage(one, two, three) {
  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
  const urls = [
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`,
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`,
    `https://graph.facebook.com/${three}/picture?width=512&height=512&access_token=${token}`
  ];

  const [avatarOne, avatarTwo, avatarThree] = await Promise.all(urls.map(url => jimp.read(url)));

  const background = await jimp.read("https://i.ibb.co/7yPR6Xf/image.jpg");
  background
    .resize(2452, 1226)
    .composite(avatarOne.resize(405, 405), 206, 345)
    .composite(avatarTwo.resize(400, 400), 1830, 350)
    .composite(avatarThree.resize(450, 450), 1010, 315);

  const imagePath = `wanted_${Date.now()}.png`;
  await background.writeAsync(imagePath);
  return imagePath;
}

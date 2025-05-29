const axios = require("axios");
const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

const config = {
  name: "hack",
  version: "1.0.0",
  author: "priyansh x Saim",
  description: "Generate a hack-style image with user's avatar and name",
  usage: "@mention",
  cooldowns: 0,
  role: 0,
  category: "fun",
};

function wrapText(ctx, name, maxWidth) {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);
    const words = name.split(" ");
    const lines = [];
    let line = "";
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

async function onStart({ api, event, usersData }) {
  try {
    const pathImg = __dirname + "/cache/background.png";
    const pathAvt = __dirname + "/cache/avatar.png";
    const id = Object.keys(event.mentions)[0] || event.senderID;
    const name = await usersData.getName(id);

    const backgroundList = [
      "https://i.imghippo.com/files/qEl8678STs.png"
    ];
    const bgURL = backgroundList[Math.floor(Math.random() * backgroundList.length)];

    const getAvatar = (
      await axios.get(
        `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(pathAvt, Buffer.from(getAvatar, "utf-8"));

    const getBackground = (
      await axios.get(bgURL, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getBackground, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const baseAvatar = await loadImage(pathAvt);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    const lines = await wrapText(ctx, name, 1160);
    ctx.fillText(lines.join("\n"), 200, 497);
    ctx.beginPath();
    ctx.drawImage(baseAvatar, 83, 437, 100, 101);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(pathAvt);

    return api.sendMessage(
      { body: "Here's your image 🧠", attachment: fs.createReadStream(pathImg) },
      event.threadID,
      () => fs.unlinkSync(pathImg),
      event.messageID
    );
  } catch (error) {
    return api.sendMessage(error.message, event.threadID, event.messageID);
  }
}

module.exports = {
  config,
  onStart
};

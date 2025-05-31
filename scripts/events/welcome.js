const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");
const moment = require("moment-timezone");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
  config: {
    name: "join",
    eventType: ["log:subscribe"],
    version: "3.1.0",
    credits: "ChatGPT x You",
    description: "Sends a welcome image exactly like provided banner style"
  },

  circle: async function (imagePath) {
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
  },

  onStart: async function () {},

  onEvent: async function ({ event, api, client }) {
    const threadID = event.threadID;
    const addedUsers = event.logMessageData?.addedParticipants;
    if (!addedUsers || !Array.isArray(addedUsers)) return;

    for (const user of addedUsers) {
      if (user.userFbId == client.userID) {
        api.sendMessage(`🤖 Bot has joined this group!\nUse: ${global.config.PREFIX}help`, threadID);
        return;
      }

      const name = user.fullName;
      const id = user.userFbId;
      const time = moment.tz("Asia/Dhaka").format("hh:mm A - DD/MM/YYYY");

      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName || "Group";
      const memberCount = threadInfo.participantIDs.length;

      const avatarUrl = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      const bgUrl = "https://i.imgur.com/InxuJ4z.jpeg";

      const pathAvt = __dirname + "/cache/avatar.png";
      const pathBg = __dirname + "/cache/bg.png";
      const imgPath = __dirname + "/cache/welcome.png";
      const fontPath = __dirname + "/cache/Semi.ttf";

      try {
        const [avtRes, bgRes] = await Promise.all([
          axios.get(avatarUrl, { responseType: "arraybuffer" }),
          axios.get(bgUrl, { responseType: "arraybuffer" })
        ]);
        fs.writeFileSync(pathAvt, Buffer.from(avtRes.data));
        fs.writeFileSync(pathBg, Buffer.from(bgRes.data));

        const circleAvt = await this.circle(pathAvt);
        const base = await loadImage(pathBg);
        const avatar = await loadImage(circleAvt);

        if (!fs.existsSync(fontPath)) {
          const fontData = (await axios.get("https://github.com/thebestajs/fonts/raw/main/Semi.ttf", {
            responseType: "arraybuffer"
          })).data;
          fs.writeFileSync(fontPath, Buffer.from(fontData));
        }
        registerFont(fontPath, { family: "Semi" });

        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext("2d");

        // Background & avatar
        ctx.drawImage(base, 0, 0, 800, 400);
        ctx.drawImage(avatar, 50, 100, 200, 200);

        // Text style
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        ctx.font = 'bold 28px "Semi"';
        ctx.fillText(`WELCOME TO`, 560, 130);

        ctx.font = 'bold 32px "Semi"';
        ctx.fillText(`${groupName}`, 560, 170);

        ctx.font = 'bold 36px "Semi"';
        ctx.fillText(`${name}`, 560, 220);

        ctx.font = '24px "Semi"';
        ctx.fillText(`You are member #${memberCount}`, 560, 260);
        ctx.fillText(`${time}`, 560, 295);

        const imgBuffer = canvas.toBuffer("image/png");
        fs.writeFileSync(imgPath, imgBuffer);

        api.sendMessage({
          body: `🎉 Welcome ${name} to ${groupName}!\nYou are member #${memberCount}.`,
          attachment: fs.createReadStream(imgPath)
        }, threadID, () => {
          fs.unlinkSync(pathAvt);
          fs.unlinkSync(pathBg);
          fs.unlinkSync(imgPath);
        });

      } catch (err) {
        console.error("Join banner error:", err);
        api.sendMessage(`⚠️ Couldn't create welcome banner for ${name}`, threadID);
      }
    }
  }
};

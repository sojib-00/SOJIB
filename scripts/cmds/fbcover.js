const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json");
  return base.data.api;
};

module.exports = {
  config: {
    name: "fbcover",
    aliases: [],
    version: "6.9",
    author: "Dipto",
    countDown: 5,
    role: 0,
    shortDescription: "Create FB cover photo",
    longDescription: "Generate a custom Facebook cover using provided info",
    category: "image generator",
    guide: {
      vi: "[v1/v2/v3] - name - title - address - email - phone - color",
      en: "[v1/v2/v3] - name - title - address - email - phone - color"
    }
  },

  onStart: async function ({ message, event, args, usersData, api }) {
    const input = args.join(" ");
    let id;

    if (event.type === "message_reply") {
      id = event.messageReply.senderID;
    } else {
      id = Object.keys(event.mentions)[0] || event.senderID;
    }

    const userName = await usersData.getName(id);

    if (!input) {
      return message.reply(`❌| Wrong input.\nTry: fbcover v1/v2/v3 - name - title - address - email - phone - color (default = white)`);
    }

    const msg = input.split("-");
    const v = msg[0]?.trim() || "v1";
    const name = msg[1]?.trim() || " ";
    const subname = msg[2]?.trim() || " ";
    const address = msg[3]?.trim() || " ";
    const email = msg[4]?.trim() || " ";
    const phone = msg[5]?.trim() || " ";
    const color = msg[6]?.trim() || "white";

    await message.reply("Processing your cover, wait koro baby 😘");

    const imgUrl = `${await baseApiUrl()}/cover/${v}?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&number=${encodeURIComponent(phone)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&colour=${encodeURIComponent(color)}&uid=${id}`;

    try {
      const response = await axios.get(imgUrl, { responseType: "stream" });

      await message.send({
        body: `✿━━━━━━━━━━━━━━━━━━━━━━━━━━━✿\n🔵𝗙𝗜𝗥𝗦𝗧 𝗡𝗔𝗠𝗘: ${name}\n⚫𝗦𝗘𝗖𝗢𝗡𝗗 𝗡𝗔𝗠𝗘: ${subname}\n⚪𝗔𝗗𝗗𝗥𝗘𝗦𝗦: ${address}\n📫𝗠𝗔𝗜𝗟: ${email}\n☎️𝗣𝗛𝗢𝗡𝗘 𝗡𝗢.: ${phone}\n☢️𝗖𝗢𝗟𝗢𝗥: ${color}\n💁𝗨𝗦𝗘𝗥 𝗡𝗔𝗠𝗘: ${userName}\n✅𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${v}\n✿━━━━━━━━━━━━━━━━━━━━━━━━━━━✿`,
        attachment: response.data
      });

    } catch (error) {
      console.error(error);
      message.reply("❌ FB cover generate korte somossa hoise!");
    }
  }
};

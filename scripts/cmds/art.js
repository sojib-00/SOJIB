const axios = require('axios');
const fs = require('fs-extra');
const FormData = require('form-data');
const path = __dirname + '/cache/artify.jpg';

module.exports = {
  config: {
    name: "art",
    aliases: [],
    version: "1.0",
    author: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️-edit Saim",
    countDown: 5,
    role: 0,
    shortDescription: "Apply AI art style (anime)",
    longDescription: "Reply to a photo to apply an AI anime art style.",
    category: "image",
    guide: {
      en: "{pn} [reply image]",
    }
  },

  onStart: async function ({ message, event, api }) {
    const { messageReply, threadID, messageID } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0)
      return message.reply("❌ অনুগ্রহ করে কোনো একটি ছবির রিপ্লাই দিন।");

    const url = messageReply.attachments[0].url;

    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));

      const form = new FormData();
      form.append("image", fs.createReadStream(path));

      const apiRes = await axios.post(
        "https://art-api-97wn.onrender.com/artify?style=anime",
        form,
        { headers: form.getHeaders(), responseType: "arraybuffer" }
      );

      fs.writeFileSync(path, apiRes.data);

      await message.reply({
        body: "✅ AI artify করা হয়েছে!",
        attachment: fs.createReadStream(path)
      });

      fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
      message.reply("❌ কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।");
    }
  }
};

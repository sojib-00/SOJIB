const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "time",
    aliases: ["currenttime", "timecheck"],
    version: "1.2",
    author: "Saim",
    role: 0,
    category: "utility",
    guide: "{p}time"
  },

  onStart: async function ({ api, event }) {
    try {
      const now = moment().tz("Asia/Dhaka");
      const time = now.format("hh:mm A");
      const date = now.format("dddd, D MMMM, YYYY");

      const message = `
╔═════◇◆◇═════╗
   ⏳ বর্তমান সময়   
╚═════◇◆◇═════╝
📅 তারিখ : ${date}
🕓 সময়  : ${time}
      `.trim();

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("❌ টাইম আনতে সমস্যা হয়েছে!", event.threadID, event.messageID);
      console.error("Time fetch error:", err);
    }
  }
};

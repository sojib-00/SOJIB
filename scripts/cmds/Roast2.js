global.roast2Status = {};

module.exports = {
  config: {
    name: "roast2",
    aliases: [],
    version: "1.2",
    author: "Carry Style by Saim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "CarryMinati style savage roast!"
    },
    longDescription: {
      en: "Roasts the mentioned user line by line CarryMinati style, with emojis!"
    },
    category: "Fun",
    guide: {
      en: "{pn} @mention"
    }
  },

  onStart: async function ({ message, api, event }) {
    const mentions = Object.keys(event.mentions);
    const threadID = event.threadID;

    if (mentions.length === 0)
      return message.reply("❌ Please mention someone to roast!");

    if (global.roast2Status[threadID]) {
      return message.reply("⚠️ Roast is already running in this chat. Please stop it first.");
    }

    const targetID = mentions[0];
    const targetName = event.mentions[targetID];
    const tagText = `@${targetName}`;

    const roasts = [
      "Tera swag to second-hand lagta hai bhai, asli wale to kapdon ke saath attitude bhi dhote hain! 😎",
      "Tu itna cringe hai, agar cringe ka test hota toh tu gold medal le aata! 🏅",
      "Tu real life ka lag hai — ghiste reh jaa, kaam ka kuch nahi! 🐌",
      "Teri IQ se toh room temperature bhi zyada hot hota hai! 🔥",
      "Tu dosti nahi, stress package hai — free home delivery wala! 📦",
      "Tu roast-worthy nahi, tu already burned lagta hai! 🔥",
      "Tera logic itna weak hai, usse gym membership milni chahiye! 🏋️",
      "Tu reel pe likes dhoondhta hai, real life mein koi yaad bhi nahi karta! 🕳️",
      "Tu video ka buffering hai — bas atka rehta hai! ⏳",
      "Tu real life ka pop-up hai — annoying and unwanted! 🚫"
      // ... aro add korte paro
    ];

    let index = 0;

    global.roast2Status[threadID] = setInterval(() => {
      if (index < roasts.length) {
        api.sendMessage({
          body: `${tagText}, ${roasts[index]}`,
          mentions: [{ id: targetID, tag: tagText }]
        }, threadID);
        index++;
      } else {
        clearInterval(global.roast2Status[threadID]);
        delete global.roast2Status[threadID];
      }
    }, 1800);

    message.reply(`🔥 Roast started for ${targetName}!\nType "stop" to end the roast.`);
  },

  onChat: async function ({ event, message }) {
    const threadID = event.threadID;
    const msg = event.body?.toLowerCase();

    if (msg === "stop" && global.roast2Status[threadID]) {
      clearInterval(global.roast2Status[threadID]);
      delete global.roast2Status[threadID];
      return message.reply("🛑 Roast stopped successfully!");
    }
  }
};

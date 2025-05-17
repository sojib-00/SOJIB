module.exports = {
  config: {
    name: "flagquiz",
    aliases: ["flag", "guessflag"],
    version: "1.0",
    author: "ChatGPT (Bangla & English Support)",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}flagquiz",
  },

  onStart: async function ({ api, event }) {
    const flags = [
      { emoji: "🇧🇩", country: "বাংলাদেশ", country_en: "Bangladesh" },
      { emoji: "🇮🇳", country: "ভারত", country_en: "India" },
      { emoji: "🇺🇸", country: "মার্কিন যুক্তরাষ্ট্র", country_en: "United States" },
      { emoji: "🇯🇵", country: "জাপান", country_en: "Japan" },
      { emoji: "🇧🇷", country: "ব্রাজিল", country_en: "Brazil" },
      { emoji: "🇫🇷", country: "ফ্রান্স", country_en: "France" },
      { emoji: "🇨🇳", country: "চীন", country_en: "China" }
    ];

    const selected = flags[Math.floor(Math.random() * flags.length)];

    api.sendMessage(
      `🌍 Flag Quiz Time!\n\nThis flag belongs to which country?\n${selected.emoji}\n\n✍️ Answer in either Bangla or English.`,
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "flagquiz",
          author: event.senderID,
          answer: selected.country.toLowerCase(),
          answer_en: selected.country_en.toLowerCase(),  // English answer added
          commandName: this.config.name
        });
      },
      event.messageID
    );
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author)
      return api.sendMessage("❌ This question can only be answered by the person who started it.", event.threadID, event.messageID);

    const userAnswer = event.body.trim().toLowerCase();

    if (userAnswer === Reply.answer || userAnswer === Reply.answer_en) {
      api.sendMessage(`✅ Correct Answer! It's ${Reply.answer_en} (${Reply.answer})!`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`❌ Wrong Answer! The correct answer was: ${Reply.answer_en} (${Reply.answer})`, event.threadID, event.messageID);
    }
  }
};

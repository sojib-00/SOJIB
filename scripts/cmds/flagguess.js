module.exports = {
  config: {
    name: "flagquiz",
    aliases: ["flag", "guessflag"],
    version: "1.0",
    author: "ChatGPT",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}flagquiz",
  },

  onStart: async function ({ api, event }) {
    const flags = [
      { emoji: "🇧🇩", country: "bangladesh" },
      { emoji: "🇮🇳", country: "india" },
      { emoji: "🇺🇸", country: "united states" },
      { emoji: "🇯🇵", country: "japan" },
      { emoji: "🇧🇷", country: "brazil" },
      { emoji: "🇫🇷", country: "france" },
      { emoji: "🇨🇳", country: "china" },
    ];

    const selected = flags[Math.floor(Math.random() * flags.length)];

    api.sendMessage(
      `🌐 Guess the country of this flag:\n\n${selected.emoji}\n\n✍️ Reply with the country name (in English)`,
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "flagquiz",
          author: event.senderID,
          answer: selected.country.toLowerCase(),
        });
      },
      event.messageID
    );
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author)
      return api.sendMessage("Sorry, this quiz is not for you.", event.threadID);

    const userGuess = event.body.toLowerCase();

    if (userGuess === Reply.answer) {
      api.sendMessage(`✅ Correct! It's ${Reply.answer.toUpperCase()}!`, event.threadID);
    } else {
      api.sendMessage(`❌ Wrong! The correct answer was: ${Reply.answer.toUpperCase()}`, event.threadID);
    }
  },
};

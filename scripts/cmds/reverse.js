const words = [
  "banana", "elephant", "football", "computer", "internet", "friendship",
  "language", "reverse", "keyboard", "chocolate", "bangladesh", "river",
  "planet", "mountain", "puzzle", "science", "history", "weather", "jungle",
  "holiday", "freedom", "library", "teacher", "student", "country", "city",
  "village", "culture", "knowledge", "university", "market", "flower", "animal",
  "mirror", "window", "mobile", "charger", "headphone", "pencil", "notebook",
  "english", "bicycle", "kitchen", "garden", "picture", "calendar", "rocket",
  "camera", "journey", "driving", "ocean", "desert", "island", "tiger", "parrot"
];

function reverseString(str) {
  return str.split('').reverse().join('');
}

module.exports = {
  config: {
    name: "reverse",
    aliases: ["reverseword", "rev"],
    version: "1.2",
    author: "Saim",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}reverse"
  },

  onStart: async function ({ api, event }) {
    const word = words[Math.floor(Math.random() * words.length)];
    const reversed = reverseString(word);

    api.sendMessage(
      `🔄 *Reverse Word Challenge!*\n\nEi word tar spelling ta ulta kora ache:\n🌀: ${reversed}\n\nTumi bujhte parba asli word ta ki?\n✍️ Tumi 2 bar try korte parba. Reply dao spelling shoho.`,
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reverse",
          author: event.senderID,
          answer: word,
          attempts: 1, // Track 1st attempt
          commandName: this.config.name
        });
      },
      event.messageID
    );
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author)
      return api.sendMessage("❌ Ei challenge e sudhu je start korse shei uttor dite parbe!", event.threadID, event.messageID);

    const userAnswer = event.body.trim().toLowerCase();
    const correct = Reply.answer.toLowerCase();

    if (userAnswer === correct) {
      api.sendMessage(`✅ Darun! Thik bolecho. Word ta chhilo: "${Reply.answer}"`, event.threadID, event.messageID);
    } else if (Reply.attempts === 1) {
      // First wrong attempt, give another chance
      Reply.attempts++;
      global.GoatBot.onReply.set(event.messageID, Reply); // Update state
      api.sendMessage("❌ Bhul hoyeche. Aar 1 bar try koro!", event.threadID, event.messageID);
    } else {
      api.sendMessage(`❌ Duto chance shesh. Sothik word chhilo: "${Reply.answer}"`, event.threadID, event.messageID);
    }
  }
};

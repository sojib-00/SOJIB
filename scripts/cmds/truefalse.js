module.exports = {
  config: {
    name: "truefalse",
    aliases: ["tf", "quiztf"],
    version: "1.0",
    author: "ChatGPT",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}truefalse",
  },

  onStart: async function ({ api, event }) {
    const questions = [
      { statement: "The capital of Bangladesh is Dhaka.", answer: "true" },
      { statement: "The moon is a planet.", answer: "false" },
      { statement: "Water boils at 100 degrees Celsius.", answer: "true" },
      { statement: "Humans can breathe in space without a suit.", answer: "false" },
      { statement: "There are 26 letters in the English alphabet.", answer: "true" },
    ];

    const selected = questions[Math.floor(Math.random() * questions.length)];

    api.sendMessage(
      `❓ True or False:\n\n${selected.statement}\n\nReply with **True** or **False**.`,
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "truefalse",
          author: event.senderID,
          answer: selected.answer.toLowerCase(),
        });
      },
      event.messageID
    );
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author)
      return api.sendMessage("This quiz isn't for you!", event.threadID);

    const userAnswer = event.body.toLowerCase();
    if (!["true", "false"].includes(userAnswer)) {
      return api.sendMessage("Please reply only with 'True' or 'False'.", event.threadID);
    }

    if (userAnswer === Reply.answer) {
      api.sendMessage("✅ Correct! You're right.", event.threadID);
    } else {
      api.sendMessage(`❌ Wrong! The correct answer was: ${Reply.answer.toUpperCase()}`, event.threadID);
    }
  },
};

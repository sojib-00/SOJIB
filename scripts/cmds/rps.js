module.exports = {
  config: {
    name: "rps",
    version: "2.0",
    author: "Saim x ChatGPT",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Rock Paper Scissors, GOAT Edition" },
    longDescription: { en: "Play RPS with ultimate style and savage comebacks" },
    category: "Games",
    guide: { en: "{pn} rock/paper/scissors" }
  },

  onStart: async function ({ message, args }) {
    const userChoice = args[0]?.toLowerCase();
    const choices = ["rock", "paper", "scissors"];
    if (!choices.includes(userChoice)) {
      return message.reply("❌ Use like: `rps rock` | `rps paper` | `rps scissors`");
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let resultText = "";
    let savageLine = "";

    const savageWins = [
      "🔥 You just slapped the bot like Will Smith!",
      "⚡ You outplayed the bot like a true legend!",
      "GOAT spotted. Bot can’t handle your energy!",
      "Bot: *I need a moment to cry...*"
    ];

    const savageLoses = [
      "🤖 Bot just destroyed your dreams!",
      "Haha! That was cute. Try again, loser.",
      "Your hands are as slow as 2G internet.",
      "Bot: *Another victim down.*"
    ];

    const savageDraws = [
      "Great minds think alike. Too bad you're not one.",
      "Draw! But bot still cooler though.",
      "Even when it’s a tie, bot still flexin'."
    ];

    if (userChoice === botChoice) {
      resultText = "🤝 It's a draw!";
      savageLine = savageDraws[Math.floor(Math.random() * savageDraws.length)];
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      resultText = "✅ You win!";
      savageLine = savageWins[Math.floor(Math.random() * savageWins.length)];
    } else {
      resultText = "❌ Bot wins!";
      savageLine = savageLoses[Math.floor(Math.random() * savageLoses.length)];
    }

    const messageBody = `
🎮 *R O C K — P A P E R — S C I S S O R S* 🎮

👤 You: ${userChoice.toUpperCase()}
🤖 Bot: ${botChoice.toUpperCase()}

🏆 ${resultText}
${savageLine}
`;

    message.reply(messageBody);
  }
};

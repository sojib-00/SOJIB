


const flags = [
  { emoji: "🇧🇩", country: "বাংলাদেশ", country_en: "Bangladesh" },
  { emoji: "🇮🇳", country: "ভারত", country_en: "India" },
  { emoji: "🇺🇸", country: "মার্কিন যুক্তরাষ্ট্র", country_en: "United States" },
  { emoji: "🇯🇵", country: "জাপান", country_en: "Japan" },
  { emoji: "🇧🇷", country: "ব্রাজিল", country_en: "Brazil" },
  { emoji: "🇫🇷", country: "ফ্রান্স", country_en: "France" },
  { emoji: "🇨🇳", country: "চীন", country_en: "China" },
  { emoji: "🇩🇪", country: "জার্মানি", country_en: "Germany" },
  { emoji: "🇬🇧", country: "যুক্তরাজ্য", country_en: "United Kingdom" },
  { emoji: "🇮🇹", country: "ইতালি", country_en: "Italy" },
  { emoji: "🇪🇸", country: "স্পেন", country_en: "Spain" },
  { emoji: "🇷🇺", country: "রাশিয়া", country_en: "Russia" },
  { emoji: "🇰🇷", country: "দক্ষিণ কোরিয়া", country_en: "South Korea" },
  { emoji: "🇦🇺", country: "অস্ট্রেলিয়া", country_en: "Australia" },
  { emoji: "🇨🇦", country: "কানাডা", country_en: "Canada" },
  { emoji: "🇲🇽", country: "মেক্সিকো", country_en: "Mexico" },
  { emoji: "🇿🇦", country: "দক্ষিণ আফ্রিকা", country_en: "South Africa" },
  { emoji: "🇮🇩", country: "ইন্দোনেশিয়া", country_en: "Indonesia" },
  { emoji: "🇳🇿", country: "নিউজিল্যান্ড", country_en: "New Zealand" },
  { emoji: "🇵🇭", country: "ফিলিপাইনস", country_en: "Philippines" }
  // Add more if needed
];

function getRandomOptions(correctFlag, count = 4) {
  const shuffled = flags.filter(f => f.country !== correctFlag.country)
                        .sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0, count - 1);
  options.push(correctFlag);
  return options.sort(() => 0.5 - Math.random());
}

module.exports = {
  config: {
    name: "flagquiz",
    aliases: ["flag", "guessflag"],
    version: "1.1",
    author: "ChatGPT Bangla",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}flagquiz"
  },

  onStart: async function ({ api, event }) {
    const selected = flags[Math.floor(Math.random() * flags.length)];
    const options = getRandomOptions(selected);

    let message = `🌍 Flag Quiz Time!\n\nWhich country does this flag belong to?\n${selected.emoji}\n\nOptions:\n`;
    options.forEach((opt, i) => {
      message += `${i + 1}. ${opt.country_en} (${opt.country})\n`;
    });

    api.sendMessage(
      message + `\n✍️ Reply with the option number (e.g. 1, 2, 3, 4).`,
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "flagquiz",
          author: event.senderID,
          answer: selected,
          options,
          commandName: this.config.name
        });
      },
      event.messageID
    );
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author)
      return api.sendMessage("❌ Ei quiz question er answer sudhu je start korse she dite parbe.", event.threadID, event.messageID);

    const userInput = event.body.trim();
    const selectedIndex = parseInt(userInput);

    if (isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > 4)
      return api.sendMessage("❌ Valid number dao (1 theke 4 er moddhe).", event.threadID, event.messageID);

    const chosen = Reply.options[selectedIndex - 1];
    const correct = Reply.answer;

    if (chosen.country_en.toLowerCase() === correct.country_en.toLowerCase()) {
      api.sendMessage(`✅ Sothik! It's ${correct.country_en} (${correct.country})`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`❌ Bhul! Sothik uttor chilo: ${correct.country_en} (${correct.country})`, event.threadID, event.messageID);
    }
  }
};

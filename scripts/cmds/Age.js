const moment = require('moment');

module.exports = {
  config: {
    name: "age",
    aliases: ["agecalc", "boyosh"],
    version: "1.2",
    author: "YourName",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Calculate age accurately from birth date"
    },
    longDescription: {
      en: "Gives accurate age in years, months, and days using your birth date"
    },
    category: "Utility",
    guide: {
      en: "{pn} YYYY-MM-DD"
    }
  },

  onStart: async function ({ message, args }) {
    if (args.length === 0) {
      return message.reply("⚠️ *Please provide your birth date!*\n\n📝 Example:\n`age 2005-08-15`");
    }

    const birthDate = moment(args[0], "YYYY-MM-DD", true);
    if (!birthDate.isValid()) {
      return message.reply("❌ *Invalid date format!*\nUse: `YYYY-MM-DD`\nExample: `2005-08-15`");
    }

    const now = moment();
    const years = now.diff(birthDate, 'years');
    const months = now.diff(birthDate.clone().add(years, 'years'), 'months');
    const days = now.diff(birthDate.clone().add(years, 'years').add(months, 'months'), 'days');

    const ageMessage = `
╔═══❖•ೋ° °ೋ•❖═══╗
  🔢 𝘼𝙂𝙀 𝘾𝘼𝙇𝘾𝙐𝙇𝘼𝙏𝙊𝙍  
╚═══❖•ೋ° °ೋ•❖═══╝

📆 𝗕𝗶𝗿𝘁𝗵 𝗗𝗮𝘁𝗲: ${birthDate.format("LL")}
🕒 𝗧𝗼𝗱𝗮𝘆: ${now.format("LL")}

🧮 𝗧𝘂𝗺𝗮𝗿 𝗯𝗼𝘆𝗼𝘀𝗵: 
⇨ ${years} 𝘆𝗲𝗮𝗿𝘀  
⇨ ${months} 𝗺𝗼𝗻𝘁𝗵𝘀  
⇨ ${days} 𝗱𝗮𝘆𝘀

╭─────────────╮
│ 💡 Accurate calendar-based age
╰─────────────╯
`;

    return message.reply(ageMessage);
  }
};

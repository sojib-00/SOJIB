const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "S A I M",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "╔════════════ ∘◦ ✿ ◦∘ ════════════╗";
      msg += `\n               ʜᴇʟᴘ ᴍᴇɴᴜ`;
      msg += `\n╚════════════ ∘◦ ❀ ◦∘ ════════════╝\n`;

      for (const [name, value] of commands) {
        // ✅ Filter: Skip invalid or broken commands
        if (!value?.config || typeof value.onStart !== "function") continue;
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n\n❖═════『  ${category.toUpperCase()} 』═════❖`;
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names
              .slice(i, i + 3)
              .map((item) => `➤ ${stylizeSmallCaps(item)}`);
            msg += `\n${cmds.join("     ")}`;
          }
        }
      });

      msg += `\n\n╔═━「 ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅꜱ 」━═╗`;
      msg += `\n➤ Total: ${commands.size}`;
      msg += `\n➤ Use: ${prefix}help <command>`;
      msg += `\n╚═━──────────────━═╝`;

      msg += `\n\n╭─────⊹⊱✫⊰⊹─────╮`;
      msg += `\n       ᴅᴇᴠ: ꜱ ᴀ ɪ ᴍ`;
      msg += `\n╰─────⊹⊱✫⊰⊹─────╯`;

      const helpListImages = ["https://files.catbox.moe/9f7p0a.jpg"];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command || !command?.config) {
        await message.reply(`Sorry! Command "${commandName}" khuja jay nai.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `
╭───⊙
│ 🔶 ${stylizeSmallCaps(configCommand.name)}
├── INFO
│ 📝 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ: ${longDescription}
│ 👑 ᴀᴜᴛʜᴏʀ: ${author}
│ ⚙ ɢᴜɪᴅᴇ: ${usage}
├── USAGE
│ 🔯 ᴠᴇʀꜱɪᴏɴ: ${configCommand.version || "1.0"}
│ ♻ʀᴏʟᴇ: ${roleText}
╰────────────⊙`;

        await message.reply(response);
      }
    }
  },
};

// Small Caps Font Converter
function stylizeSmallCaps(text) {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
    j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
    s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
    J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ',
    S: 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9'
  };
  return text.split('').map(c => map[c] || c).join('');
}

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Bot admins)";
    default:
      return "Unknown role";
  }
            }

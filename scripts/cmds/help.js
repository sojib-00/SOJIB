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
      // Full command list with custom style
      const categories = {};
      let msg = "☻︎━━━━━━━━━━━━━━☻︎\n";
      msg += "           ℍ𝕖𝕝𝕡 𝕄𝕖𝕟𝕦\n";
      msg += "☺︎︎━━━━━━━━━━━━━━㋛︎\n";

      for (const [name, value] of commands) {
        if (!value?.config || typeof value.onStart !== "function") continue;
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      for (const category of Object.keys(categories).sort()) {
        if (category !== "info") {
          msg += `┍━[  ${category.toUpperCase()} ]\n`;
          const names = categories[category].commands.sort();
          for (const cmd of names) {
            msg += `┋☄${cmd}\n`;
          }
          msg += "┕━━━━━━━━━━━━━☻︎\n";
        }
      }

      // Info footer
      msg += "┍━━━[𝙸𝙽𝙵𝚁𝙾𝙼]━━━☹︎\n";
      msg += `┋➥𝚃𝙾𝚃𝙰𝙻𝙲𝙼𝙳: [${commands.size}]\n`;
      msg += `┋➥𝙿𝚁𝙴𝙵𝙸𝚇: ${prefix}\n`;
      msg += `┋𝙾𝚆𝙽𝙴𝚁: Ew'r Saim\n`;
      msg += "┕━━━━━━━━━━━━☹︎";

      const helpListImages = ["https://files.catbox.moe/9f7p0a.jpg"];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });

    } else {
      // Detailed help for specific command
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

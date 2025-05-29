const request = require("request");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "setallbox",
    version: "1.0.9",
    author: "𝐂𝐘𝐁𝐄𝐑 ☢️ 𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴 ☢️-edit Saim",
    role: 1,
    shortDescription: {
      en: "Change box settings"
    },
    longDescription: {
      en: "Set emoji, name, avatar, poll, nickname, etc."
    },
    category: "box chat",
    guide: {
      en: "{pn} emoji\n{pn} Bname <name>\n{pn} name <name>\n{pn} avt (reply image)\n{pn} poll <title> => <option1> | <option2>\n{pn} QTV <mention/reply/uid>\n{pn} rcolor"
    }
  },

  onStart: async function ({ api, event, args, usersData, threadsData }) {
    const emojiList = "😀,😃,😄,...,🕛".split(","); // (shortened for readability)

    const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

    switch (args[0]) {
      case "emoji": {
        const emoji = args[1] || emojiList[Math.floor(Math.random() * emojiList.length)];
        try {
          await api.changeThreadEmoji(emoji, event.threadID);
        } catch (e) {
          return send(`${e.name}: ${e.message}`);
        }
        break;
      }

      case "Bname": {
        const name = args.slice(1).join(" ");
        if (!name) return send("Please provide a name.");
        api.setTitle(name, event.threadID);
        break;
      }

      case "name": {
        const nickname = args.slice(1).join(" ");
        const mention = Object.keys(event.mentions)[0];
        if (!nickname) return send("Provide a nickname.");
        if (mention) {
          return api.changeNickname(nickname.replace(event.mentions[mention], ""), event.threadID, mention);
        } else {
          return api.changeNickname(nickname, event.threadID, event.senderID);
        }
      }

      case "avt": {
        if (event.type !== "message_reply" || !event.messageReply.attachments[0] || event.messageReply.attachments[0].type !== "photo") {
          return send("Please reply to an image to set as group avatar.");
        }

        const imageUrl = event.messageReply.attachments[0].url;
        const path = __dirname + "/cache/avatar.png";

        request(imageUrl)
          .pipe(fs.createWriteStream(path))
          .on("close", () => {
            api.changeGroupImage(fs.createReadStream(path), event.threadID, () => fs.unlinkSync(path));
          });
        break;
      }

      case "poll": {
        const content = args.join(" ");
        const title = content.slice(5, content.indexOf(" => "));
        const options = content.slice(content.indexOf(" => ") + 4).split(" | ");

        if (!title || options.length < 2) {
          return send("Invalid format. Use: poll <title> => option1 | option2");
        }

        const pollOptions = {};
        for (let option of options) pollOptions[option.trim()] = false;

        api.createPoll(title, event.threadID, pollOptions, (err) => {
          if (err) return send("Failed to create poll.");
        });
        break;
      }

      case "QTV": {
        const threadInfo = await threadsData.get(event.threadID);
        const isSenderAdmin = threadInfo.adminIDs.some(e => e.id === event.senderID);

        if (!isSenderAdmin) return send("You are not an admin!");

        const targetID = Object.keys(event.mentions)[0] || (event.type === "message_reply" ? event.messageReply.senderID : args[1]);

        if (!targetID) return send("Mention or reply to someone to change admin status.");

        const isTargetAdmin = threadInfo.adminIDs.some(e => e.id === targetID);
        api.changeAdminStatus(event.threadID, targetID, !isTargetAdmin);
        break;
      }

      case "rcolor": {
        const colors = [
          '196241301102133', '169463077092846', '2442142322678320',
          '234137870477637', '980963458735625', '175615189761153',
          '2136751179887052', '2058653964378557', '2129984390566328'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        api.changeThreadColor(color, event.threadID, (err) => {
          if (err) return send("Couldn't change thread color.");
        });
        break;
      }

      default:
        return send("Invalid option. Use: emoji, Bname, name, avt, poll, QTV, rcolor.");
    }
  }
};

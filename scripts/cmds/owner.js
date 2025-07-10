const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    author: "Tokodori", // Converted by GoatBot Tokodori
    role: 0,
    shortDescription: "Display bot owner's info",
    longDescription: "Shows stylish digital profile of the owner with video",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const ownerInfo = {
        name: '⚡ AVOID SOJIB ⚡',
        gender: '♂️ Male',
        class: '🎓 Class 9',
        location: '📍 Rajshahi, Bangladesh',
        color: '💙 Blue',
        band: '🎸 Warfaze',
        status: '💔 Single',
        facebook: '🌐 fb.com/share/15sGUW8VqW/'
      };

      const videoURL = 'https://i.imgur.com/LbneO8C.mp4'; // Optional: Replace with your own stylish video link
      const tmpFolderPath = path.join(__dirname, 'tmp');
      if (!fs.existsSync(tmpFolderPath)) fs.mkdirSync(tmpFolderPath);

      const videoResponse = await axios.get(videoURL, { responseType: 'arraybuffer' });
      const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');
      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

      const response = `
╔═════════════════💠═════════════════╗
║        👑 𝗢𝗪𝗡𝗘𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 👑         ║
╠═══════════════════════════════════╣
║ 🧬 𝗡𝗮𝗺𝗲        : ${ownerInfo.name}
║ 🚻 𝗚𝗲𝗻𝗱𝗲𝗿      : ${ownerInfo.gender}
║ 🏫 𝗖𝗹𝗮𝘀𝘀       : ${ownerInfo.class}
║ 🌍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻    : ${ownerInfo.location}
║ 🎨 𝗙𝗮𝘃 𝗖𝗼𝗹𝗼𝗿   : ${ownerInfo.color}
║ 🎧 𝗙𝗮𝘃 𝗕𝗮𝗻𝗱    : ${ownerInfo.band}
║ ❤️ 𝗦𝘁𝗮𝘁𝘂𝘀     : ${ownerInfo.status}
║ 🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸   : ${ownerInfo.facebook}
╚═════════════════💠═════════════════╝

🌟 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗬 𝗕𝗢𝗧 🌟`;

      await api.sendMessage({
        body: response,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

      if (event.body.toLowerCase().includes('ownerinfo')) {
        api.setMessageReaction('👑', event.messageID, () => {}, true);
      }
    } catch (error) {
      console.error('Error in owner command:', error);
      return api.sendMessage('⚠️ Error loading digital owner profile.', event.threadID);
    }
  },
};

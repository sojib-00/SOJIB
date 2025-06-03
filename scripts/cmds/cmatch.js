const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "cmatch",
    version: "2.1",
    author: "ChatGPT + Xemon",
    shortDescription: {
      en: "Find your perfect couple match with gender filter"
    },
    category: "love",
    guide: "{prefix}cmatch"
  },

  onStart: async function({ event, threadsData, message, usersData, api }) {
    const uidI = event.senderID;
    const name1 = await usersData.getName(uidI);
    const avatarUrl1 = await usersData.getAvatarUrl(uidI);

    // Get user and group data
    const threadInfo = await api.getThreadInfo(event.threadID);
    const allMembers = threadInfo.userInfo;
    let gender1;

    for (let user of allMembers) {
      if (user.id == uidI) {
        gender1 = user.gender; // "MALE", "FEMALE", or undefined
        break;
      }
    }

    const botID = api.getCurrentUserID();
    let eligibleMembers = [];

    // Filter members based on gender
    if (gender1 === "FEMALE") {
      eligibleMembers = allMembers.filter(u =>
        u.gender === "MALE" && u.id !== uidI && u.id !== botID
      );
    } else if (gender1 === "MALE") {
      eligibleMembers = allMembers.filter(u =>
        u.gender === "FEMALE" && u.id !== uidI && u.id !== botID
      );
    } else {
      // If gender unknown, pick anyone except self & bot
      eligibleMembers = allMembers.filter(u =>
        u.id !== uidI && u.id !== botID
      );
    }

    if (eligibleMembers.length === 0) {
      return message.reply("😕 Sorry! No suitable match found in this group.");
    }

    // Pick one match randomly
    const randomMember = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
    const name2 = await usersData.getName(randomMember.id);
    const avatarUrl2 = await usersData.getAvatarUrl(randomMember.id);

    // Love & compatibility scores
    const lovePercent = Math.floor(Math.random() * 41) + 60;
    const compatibility = Math.floor(Math.random() * 41) + 60;
    const middleImage = "https://files.catbox.moe/2xe6tg.jpg";

    const msg = `
╔═════════════════════════╗
     💘  𝐂𝐨𝐮𝐩𝐥𝐞 𝐌𝐚𝐭𝐜𝐡 𝐑𝐞𝐬𝐮𝐥𝐭  💘
╚═════════════════════════╝

✨ Couple: ${name1} ❤️ ${name2}
❤️ Love Score: ${lovePercent}%
💞 Compatibility: ${compatibility}%

Are they truly a perfect couple?  
React and let us know! ❤️‍🔥✨💬
`;

    return message.reply({
      body: msg,
      attachment: [
        await getStreamFromURL(avatarUrl1),
        await getStreamFromURL(middleImage),
        await getStreamFromURL(avatarUrl2)
      ]
    });
  }
};

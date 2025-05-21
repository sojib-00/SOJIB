const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "1.0",
    author: "S A I M",
    category: "events",
  },

  langs: {
    en: {
      welcomeMessage: `
╔════════════════════════════════════╗
║                                    
║   ✨ A NEW LEGEND HAS ENTERED ✨     
║                                    
╟────────────────────────────────────╢
║   🧾 NAME         : {userName}
║   🏡 GROUP        : {boxName}
║   🔢 MEMBER NO.   : {memberCount}
║   ⏰ JOINED AT     : {time}
╟────────────────────────────────────╢
║   ⚠ RULES: Be kind, stay active,
║      respect all & vibe hard!
║
║   Welcome {userNameTag}!
║   This ain’t just a group—it’s a whole vibe!
║
║   ➤ Owner: S A I M
╚════════════════════════════════════╝
      `,
    },
  },

  onStart: async ({ message, event, api, threadsData, getLang }) => {
    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);

    // If the bot is added to the group
    if (event.logMessageType == "log:subscribe") {
      const dataAddedParticipants = event.logMessageData.addedParticipants;

      if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
        if (nickNameBot)
          api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
        return message.send(getLang("welcomeMessage", prefix));
      }

      // Process new member join event
      if (!global.temp.welcomeEvent[threadID])
        global.temp.welcomeEvent[threadID] = {
          joinTimeout: null,
          dataAddedParticipants: [],
        };

      global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
      clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

      // Set timeout for new join
      global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
        const threadData = await threadsData.get(threadID);
        if (threadData.settings.sendWelcomeMessage == false) return;

        const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
        const dataBanned = threadData.data.banned_ban || [];
        const threadName = threadData.threadName;
        const userName = [],
          mentions = [];
        let multiple = false;

        if (dataAddedParticipants.length > 1) multiple = true;

        for (const user of dataAddedParticipants) {
          if (dataBanned.some((item) => item.id == user.userFbId)) continue;
          userName.push(user.fullName);
          mentions.push({
            tag: user.fullName,
            id: user.userFbId,
          });
        }

        if (userName.length == 0) return;
        
        let { welcomeMessage = getLang("welcomeMessage") } = threadData.data;
        const form = {
          mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null,
        };
        
        // Replace dynamic placeholders in the welcome message
        welcomeMessage = welcomeMessage
          .replace(/\{userName\}/g, userName.join(", "))
          .replace(/\{boxName\}/g, threadName)
          .replace(/\{memberCount\}/g, dataAddedParticipants.length)
          .replace(/\{time\}/g, new Date().toLocaleString())
          .replace(/\{userNameTag\}/g, userName.join(", "));
        
        form.body = welcomeMessage;

        if (threadData.data.welcomeAttachment) {
          const files = threadData.data.welcomeAttachment;
          const attachments = files.reduce((acc, file) => {
            acc.push(global.utils.drive.getFile(file, "stream"));
            return acc;
          }, []);
          form.attachment = (await Promise.allSettled(attachments))
            .filter(({ status }) => status == "fulfilled")
            .map(({ value }) => value);
        }
        message.send(form);
        delete global.temp.welcomeEvent[threadID];
      }, 1500);
    }
  },
};

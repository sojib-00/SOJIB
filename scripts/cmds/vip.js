const fs = require("fs");
const path = __dirname + "/cache/vip.json";

module.exports = {
  config: {
    name: "vip",
    version: "2.1",
    author: "Amit Max ⚡",
    role: 2,
    shortDescription: "VIP system with message feature",
    category: "admin",
    guide: {
      en: "{pn} add [@tag/reply/uid] | remove [@tag/reply/uid] | list\n{pn} [message] (send to all VIPs)\n{pn} reply [@reply] (reply to VIP message)"
    }
  },

  langs: {
    en: {
      missingMessage: "হালা! তুই VIP না, এইটা ইউজ করতে আইছোস? ভাগ এখান থেইকা, নাটক করিস না!",
      sendByGroup: "\n- একটা দলবাজ গ্রুপ পাঠাইছে: %1\n- থ্রেড আইডিঃ %2",
      sendByUser: "\n- একখান বেহায়া ইউজার পাঠাইছে রে ভাই!",
      content: "\n\nVIP এর চিল্লা-চিল্লিঃ\n%1\nতোরে কইতে হইলে নিচে রিপ্লাই দে, না পারলে চুপচাপ থাক!",
      success: "VIP দের বাচ্চাদের কাছে তোর বার্তা পাঠায়া দিছি!\n%2\nদেখি এবার কেডা ক্যাঁক ক্যাঁক করে!",
      failed: "ফেইল মারছে ভাই! VIP দের কাছে পাঠাইতে গিয়া বটের বাপো হইছে।\n%2\nকনসোলে যাইয়া নিজেরে থাপ্পড় মার!",
      reply: "📍 VIP %1 এর কান্না-কাটি:\n%2",
      replySuccess: "VIP পোলারে গালি পাঠাইছি, এখন দেখ কেমনে মুখ লুকায়!",
      feedback: "📝 VIP পোলা %1 এর মুখের উপর ঝাড়:\n- UID: %2\n%3\n\nবার্তাটা পড়:\n%4",
      replyUserSuccess: "গালিটা ঠিক ঠাক দিয়া দিছিস ভাই, পাঠায়া দিলাম সরাসরি মুখে!",
      noAdmin: "তুই এডমিন না ভাই! আগে গিয়া চা বানাস, তারপর আয় বট নেড়াচাড়া করতে!",
      addSuccess: "VIP লিস্টে ঢুকছিস মানে এখন তুই একটু গরম! বেশি গ্যাঞ্জাম কইরো না!",
      alreadyInVIP: "এই পোলারে আবার VIP বানাইতে চাস? আগেই ঢুকা, আর কিছুর অভাব আছে?",
      removeSuccess: "VIP লিস্ট থেইকা ছাঁটাই কইরা দিছি! এখন তুই ঘাস খা, আর চুপ থাক!",
      notInVIP: "VIP তো দূরের কথা, এই পোলা তো পোলাপানের পেছনে ঘুইরা বেড়ায়!",
      list: "এই হইলো VIP পোলাপান:\n%1\nতাদেরে কিছু কইলে আগে পাসওয়ার্ড চাইবি!",
      vipModeEnabled: "VIP মোড অন করলাম! এখন ভিআইপি না হইলে তোরে বট ঘাড় ধইরা বাইর কইরা দিবে!",
      vipModeDisabled: "VIP মোড অফ হইছে! এখন সবারে ল্যাহাই দে, বাঁশ দে, ঝাড় দে!"
    }
  },

  onStart: async function ({ message, args, event, threadsData, usersData, role, getLang }) {
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];

    if (args[0] == "add") {
      if (role < 2) return message.reply(getLang("noAdmin"));
      const uid = event.messageReply?.senderID || event.mentions?.[Object.keys(event.mentions)[0]] || args[1];
      if (!uid) return message.reply("UID দিন বা কাউরে reply/tag করেন।");
      if (data.includes(uid)) return message.reply(getLang("alreadyInVIP"));
      data.push(uid);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(getLang("addSuccess"));
    }

    if (args[0] == "remove") {
      if (role < 2) return message.reply(getLang("noAdmin"));
      const uid = event.messageReply?.senderID || event.mentions?.[Object.keys(event.mentions)[0]] || args[1];
      if (!uid) return message.reply("UID দিন বা কাউরে reply/tag করেন।");
      if (!data.includes(uid)) return message.reply(getLang("notInVIP"));
      data.splice(data.indexOf(uid), 1);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(getLang("removeSuccess"));
    }

    if (args[0] == "list") {
      const names = await Promise.all(data.map(id => usersData.getName(id)));
      return message.reply(getLang("list", names.map((name, i) => `${i + 1}. ${name}`).join("\n")));
    }

    if (args[0] == "reply") {
      if (role < 2) return message.reply(getLang("noAdmin"));
      if (!event.messageReply) return message.reply("Reply দিয়ে VIP message ধর!");
      const uid = event.messageReply.senderID;
      message.send({
        body: getLang("reply", usersData.getName(uid), args.slice(1).join(" ")),
        mentions: [{ id: uid }]
      });
      return message.reply(getLang("replyUserSuccess"));
    }

    // send message to all VIPs
    if (!args[0]) return message.reply(getLang("missingMessage"));
    const msg = args.join(" ");
    let success = 0, failed = 0;
    for (const uid of data) {
      try {
        await message.send({
          body: getLang("feedback", usersData.getName(event.senderID), event.senderID,
            event.threadID ? getLang("sendByGroup", threadsData.get(event.threadID)?.threadName || "Unknown", event.threadID)
                           : getLang("sendByUser"),
            msg),
        }, uid);
        success++;
      } catch (e) {
        failed++;
      }
    }
    return message.reply(getLang("success", `${success} পাঠানো, ${failed} ফেইল`));
  }
};

module.exports = {

config: {

name: "mathrace",

aliases: ["mathrace", "গণিত", "math", "গেমগণিত"],

version: "1.2",

author: "Saim (Bangla + English)",

countDown: 0,

role: 0,

category: "game | গেম",

guide: "{p}mathrace",

},


onStart: async function ({ api, event }) {

const num1 = Math.floor(Math.random() * 50) + 1;

const num2 = Math.floor(Math.random() * 50) + 1;

const operators = ["+", "-", "*"];

const operator = operators[Math.floor(Math.random() * operators.length)];


const question = `${num1} ${operator} ${num2}`;

let answer;

switch (operator) {

case "+": answer = num1 + num2; break;

case "-": answer = num1 - num2; break;

case "*": answer = num1 * num2; break;

}


api.sendMessage(

`📢 গণিত রেস শুরু!\n\nপ্রশ্ন:\n➡️ ${question} = ?\n\n⏳ আপনার সময়: ৪৫ সেকেন্ড!\n✍️ ইংরেজি বা বাংলা সংখ্যায় উত্তর দিন।`,

event.threadID,

(err, info) => {

const timeout = setTimeout(() => {

api.sendMessage(`⏰ সময় শেষ! সঠিক উত্তর ছিল: ${answer}`, event.threadID);

global.GoatBot.onReply.delete(info.messageID);

}, 45000); // 45 sec


global.GoatBot.onReply.set(info.messageID, {

type: "mathrace",

author: event.senderID,

answer: answer.toString(),

commandName: "mathrace",

timeout

});

},

event.messageID

);

},


onReply: async function ({ event, api, Reply }) {

if (event.senderID !== Reply.author)

return api.sendMessage("❌ শুধুমাত্র যে প্রশ্ন করেছে সেই উত্তর দিতে পারবে।", event.threadID, event.messageID);


clearTimeout(Reply.timeout);


const banglaDigits = { "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" };

const userAnswer = event.body.trim().replace(/[০-৯]/g, d => banglaDigits[d]);


if (userAnswer === Reply.answer) {

api.sendMessage(`✅ সঠিক উত্তর! ঠিক ছিলো ${Reply.answer}`, event.threadID, event.messageID);

} else {

api.sendMessage(`❌ ভুল উত্তর। সঠিক উত্তর ছিল: ${Reply.answer}`, event.threadID, event.messageID);

}

}

};

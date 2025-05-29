const axios = require('axios');
const yts = require("yt-search");

// API URL ফেচ করার ফাংশন
const baseApiUrl = async () => {
    try {
        const response = await axios.get(
            'https://raw.githubusercontent.com/Mostakim0978/D1PT0/main/baseApiUrl.json'
        );
        return response.data.api;
    } catch (error) {
        throw new Error('API URL ফেচ করতে সমস্যা হয়েছে।');
    }
};

// গ্লোবাল API সেটআপ
(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

// স্ট্রিম ডেটা ডাউনলোড করে ফাইল সংরক্ষণ করার ফাংশন
async function getStreamFromURL(url, pathName) {
    try {
        const response = await axios.get(url, {
            responseType: "stream"
        });
        response.data.path = pathName;
        return response.data;
    } catch (err) {
        throw err;
    }
}

// গ্লোবাল ইউটিলিটি ফাংশন সেটআপ
global.utils = {
    ...global.utils,
    getStreamFromURL: global.utils?.getStreamFromURL || getStreamFromURL
};

// ইউটিউব ভিডিও আইডি বের করার ফাংশন
function getVideoID(url) {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const match = url.match(checkurl);
    return match ? match[1] : null;
}

const config = {
    name: "song",
    author: "Amit Max ⚡ | D1PT0",
    version: "1.2.0",
    role: 0,
    hasPermssion: 0,
    description: "",
    usePrefix: true,
    prfix: true,
    category: "media",
    commandCategory: "media",
    cooldowns: 5,
    countDown: 5,
};

async function onStart({ api, args, event }) {
    try {
        let videoID;
        const url = args[0];
        let w;

        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            videoID = getVideoID(url);
            if (!videoID) {
                await api.sendMessage("Invalid YouTube URL.", event.threadID, event.messageID);
                return;
            }
        } else {
            const songName = args.join(' ');
            w = await api.sendMessage(`Searching song "${songName}"... `, event.threadID);
            const r = await yts(songName);
            const videos = r.videos.slice(0, 50);

            if (videos.length === 0) {
                await api.sendMessage("No videos found for the given search term.", event.threadID, event.messageID);
                return;
            }

            const videoData = videos[Math.floor(Math.random() * videos.length)];
            videoID = videoData.videoId;
        }

        const { data: { title, quality, downloadLink } } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`);

        if (w && w.messageID) {
            api.unsendMessage(w.messageID);
        }

        const shortenedLink = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)).data;

        await api.sendMessage({
            body: `🔖 - Title: ${title}\n✨ - Quality: ${quality}\n\n📥 - Download Link: ${shortenedLink}`,
            attachment: await global.utils.getStreamFromURL(downloadLink, `${title}.mp3`)
        }, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(e.message || "An error occurred.", event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};

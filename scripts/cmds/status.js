const os = require("os");

module.exports = {
  config: {
    name: "status",
    aliases: ["health"],
    version: "1.1",
    author: "ChatGPT x Saim",
    role: 0,
    shortDescription: { en: "Bot health info" },
    longDescription: { en: "Shows latency, uptime, and system resource usage" },
    category: "utility",
    guide: {
      en: "/status"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const start = Date.now();

    api.sendMessage("⏳ Checking bot status...", threadID, async (err, info) => {
      const ping = Date.now() - start;

      const uptimeSec = process.uptime();
      const uptimeH = Math.floor(uptimeSec / 3600);
      const uptimeM = Math.floor((uptimeSec % 3600) / 60);
      const uptimeS = Math.floor(uptimeSec % 60);

      const totalMem = os.totalmem() / (1024 * 1024);
      const freeMem = os.freemem() / (1024 * 1024);
      const usedMem = totalMem - freeMem;

      const cpus = os.cpus();
      const cpuModel = cpus[0].model;
      const cpuCores = cpus.length;

      const loadAvg = os.loadavg().map(avg => avg.toFixed(2));
      const osUptimeSec = os.uptime();
      const osUpH = Math.floor(osUptimeSec / 3600);
      const osUpM = Math.floor((osUptimeSec % 3600) / 60);
      const osUpS = Math.floor(osUptimeSec % 60);

      const nodeVersion = process.version;

      const response =
`┌────────────────────────────┐
│        🤖 Bot Status        │
├────────────────────────────┤
│ 🟢 Ping: ${ping}ms
│ ⏱ Uptime: ${uptimeH}h ${uptimeM}m ${uptimeS}s
│ 💾 RAM Usage: ${usedMem.toFixed(1)}MB / ${totalMem.toFixed(1)}MB
│ 🧠 CPU: ${cpuModel} (${cpuCores} cores)
│ 📊 Load Avg: ${loadAvg.join(", ")}
│ 🖥️ System Uptime: ${osUpH}h ${osUpM}m ${osUpS}s
│ ⚙️ Node.js: ${nodeVersion}
└────────────────────────────┘`;

      api.editMessage(response, info.messageID);
    }, messageID);
  }
};

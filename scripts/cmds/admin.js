const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.5",
		author: "NTKhang & Modified by Saim & GPT",
		countDown: 5,
		role: 2,
		shortDescription: {
			en: "Add/remove/edit admin role"
		},
		longDescription: {
			en: "Add or remove admin permissions for users"
		},
		category: "box chat",
		guide: {
			en: '{pn} [add|-a] <uid|@tag>\n{pn} [remove|-r] <uid|@tag>\n{pn} [list|-l]'
		}
	},

	langs: {
		en: {
			added: "✅ Added admin role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ %1 users already had admin role:\n%2",
			missingIdAdd: "⚠️ Please provide user ID or tag to add as admin.",
			removed: "✅ Removed admin role from %1 users:\n%2",
			notAdmin: "⚠️ %1 users were not admins:\n%2",
			missingIdRemove: "⚠️ Please provide user ID or tag to remove from admin.",
			listAdmin: "👑 Admin List:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];
					const alreadyAdmins = [];

					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							alreadyAdmins.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.filter(u => notAdminIds.includes(u.uid)).map(u => `• ${u.name} (${u.uid})`).join("\n")) : "") +
						(alreadyAdmins.length > 0 ? getLang("alreadyAdmin", alreadyAdmins.length, alreadyAdmins.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else return message.reply(getLang("missingIdAdd"));
			}

			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else
						uids = args.filter(arg => !isNaN(arg));

					const removed = [];
					const notAdmin = [];

					for (const uid of uids) {
						if (config.adminBot.includes(uid)) {
							config.adminBot.splice(config.adminBot.indexOf(uid), 1);
							removed.push(uid);
						} else notAdmin.push(uid);
					}

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					const getNames = await Promise.all(removed.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					return message.reply(
						(removed.length > 0 ? getLang("removed", removed.length, getNames.map(u => `• ${u.name} (${u.uid})`).join("\n")) : "") +
						(notAdmin.length > 0 ? getLang("notAdmin", notAdmin.length, notAdmin.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else return message.reply(getLang("missingIdRemove"));
			}

			case "list":
			case "-l": {
				const getNames = await Promise.all(
					config.adminBot.map(uid =>
						usersData.getName(uid).then(name => ({ uid, name }))
					)
				);

				const ownerUIDs = ["61565898444113"]; // Ew’r Saim
				const owners = getNames.filter(e => ownerUIDs.includes(e.uid));
				const operators = getNames.filter(e => !ownerUIDs.includes(e.uid));

				let msg = "╔══════════════════════╗\n";
				msg += "   👑 𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 𝐋𝐈𝐒𝐓 👑\n";
				msg += "╚══════════════════════╝\n";

				owners.forEach(owner => {
					const styledName = owner.uid === "61565898444113" ? "𝐄𝐰ʳ 𝐒𝐚𝐢𝐦" : owner.name;
					msg += `\n🧙‍♂️ 𝗢𝗪𝗡𝗘𝗥:\n🥇 ${styledName}\n🆔 ${owner.uid}\n`;
				});

				if (operators.length > 0) {
					msg += `\n🛠️ 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥𝗦:\n`;
					operators.forEach((op, i) => {
						msg += `🔹 ${i + 1}. ${op.name}\n🆔 ${op.uid}\n`;
					});
				} else {
					msg += "\n🚫 No operators found.\n";
				}

				const total = owners.length + operators.length;
				const time = new Date().toLocaleString("en-BD", { hour12: true });
				msg += "\n═══════════════════════\n";
				msg += `📊 Total Admins: ${total} (${owners.length} Owner, ${operators.length} Operator${operators.length !== 1 ? "s" : ""})\n`;
				msg += `🕒 Last updated: ${time}`;

				return message.reply(msg);
			}

			default:
				return message.SyntaxError();
		}
	}
};

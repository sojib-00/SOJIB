// Required libraries import kora hocche
const axios = require("axios");
const moment = require("moment-timezone");
const Canvas = require("canvas");
const fs = require("fs-extra");

// Font register kora hocche weather image er text render er jonno
Canvas.registerFont(__dirname + "/assets/font/BeVietnamPro-SemiBold.ttf", {
	family: "BeVietnamPro-SemiBold"
});
Canvas.registerFont(__dirname + "/assets/font/BeVietnamPro-Regular.ttf", {
	family: "BeVietnamPro-Regular"
});

// Fahrenheit theke Celsius e convert korar function
function convertFtoC(F) {
	return Math.floor((F - 32) / 1.8);
}

// Time ke Asia/Ho_Chi_Minh timezone e format kore return kore
function formatHours(hours) {
	return moment(hours).tz("Asia/Ho_Chi_Minh").format("HH[h]mm[p]");
}

module.exports = {
	config: {
		name: "weather",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			en: "Weather forecast dekhanor command"
		},
		category: "utility",
		guide: {
			en: "{pn} <location> - Jaigai nam likho"
		},
		envGlobal: {
			weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4" // AccuWeather API key ekhane
		}
	},

	langs: {
		en: {
			syntaxError: "⛔ Location er nam dao!",
			notFound: "❌ Location pawa jaini: %1",
			error: "⚠️ Error hoise: %1",
			today: "📍 Today's weather for %1:\n\n%2\n\n🌡 Temp: %3°C - %4°C\n🌡 Feels like: %5°C - %6°C\n🌅 Sunrise: %7\n🌄 Sunset: %8\n🌃 Moonrise: %9\n🏙️ Moonset: %10\n🌞 Day: %11\n🌙 Night: %12"
		}
	},

	onStart: async function ({ args, message, envGlobal, getLang }) {
		const apikey = envGlobal.weatherApiKey;

		// User ja location dise, seta read kora
		const location = args.join(" ");
		if (!location)
			return message.reply(getLang("syntaxError"));

		let locationKey, weatherData, locationName;

		// Location er Key ber korar try
		try {
			const searchResponse = await axios.get(`https://api.accuweather.com/locations/v1/cities/search.json?q=${encodeURIComponent(location)}&apikey=${apikey}&language=en-us`);
			const result = searchResponse.data;

			if (result.length === 0)
				return message.reply(getLang("notFound", location));

			locationKey = result[0].Key;
			locationName = result[0].LocalizedName;
		} catch (err) {
			return message.reply(getLang("error", err.response?.data?.Message || err.message));
		}

		// Weather forecast data fetch kora
		try {
			const forecastResponse = await axios.get(`http://api.accuweather.com/forecasts/v1/daily/10day/${locationKey}?apikey=${apikey}&details=true&language=en`);
			weatherData = forecastResponse.data;
		} catch (err) {
			return message.reply(`❌ API error: ${err.response?.data?.Message || err.message}`);
		}

		const dailyData = weatherData.DailyForecasts;
		const today = dailyData[0];

		// Aajker weather er summary message
		const msg = getLang("today",
			locationName,
			weatherData.Headline.Text,
			convertFtoC(today.Temperature.Minimum.Value),
			convertFtoC(today.Temperature.Maximum.Value),
			convertFtoC(today.RealFeelTemperature.Minimum.Value),
			convertFtoC(today.RealFeelTemperature.Maximum.Value),
			formatHours(today.Sun.Rise),
			formatHours(today.Sun.Set),
			formatHours(today.Moon.Rise),
			formatHours(today.Moon.Set),
			today.Day.LongPhrase,
			today.Night.LongPhrase
		);

		// Background image load
		const bgImage = await Canvas.loadImage(__dirname + "/assets/image/bgWeather.jpg");
		const { width, height } = bgImage;
		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(bgImage, 0, 0, width, height);

		// Prottek din er chobi, temp, date draw kora hocche
		let xPos = 100;
		ctx.fillStyle = "#ffffff";

		for (const day of dailyData.slice(0, 7)) {
			const iconImg = await Canvas.loadImage("http://vortex.accuweather.com/adc2010/images/slate/icons/" + day.Day.Icon + ".svg");
			ctx.drawImage(iconImg, xPos, 210, 80, 80);

			ctx.font = "30px BeVietnamPro-SemiBold";
			ctx.fillText(`${convertFtoC(day.Temperature.Maximum.Value)}°C`, xPos, 366);

			ctx.font = "30px BeVietnamPro-Regular";
			ctx.fillText(`${convertFtoC(day.Temperature.Minimum.Value)}°C`, xPos, 445);
			ctx.fillText(moment(day.Date).format("DD"), xPos + 20, 140);

			xPos += 135;
		}

		// Canvas ke image hishebe save kora hocche
		const imgPath = `${__dirname}/tmp/weather_${locationKey}.jpg`;
		fs.writeFileSync(imgPath, canvas.toBuffer());

		// Message send kora hocche, tar sathe image file o
		return message.reply({
			body: msg,
			attachment: fs.createReadStream(imgPath)
		}, () => fs.unlinkSync(imgPath)); // Kaj sesh hole file delete
	}
};

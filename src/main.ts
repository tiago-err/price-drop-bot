import TelegramBot from "node-telegram-bot-api";
import {MongoClient} from "mongodb";

import {queryTypes} from "./queries";
import {commands} from "./commands";

import {parseQuery} from "./utils/parser";
import {IDrop} from "@interfaces";
import refreshDrop from "./functions/refresh";

const dotenv = require("dotenv");
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
const client = new MongoClient(mongoUrl);

const intervalSeconds = 60 * 10;

(async () => {
	// Use connect method to connect to the server
	await client.connect();
	console.log("Connected successfully to server");
	const db = client.db(process.env.MONGO_DB);
	const collection = db.collection("drops");

	// replace the value below with the Telegram token you receive from @BotFather
	const token = process.env.BOT_TOKEN;

	// Create a bot that uses 'polling' to fetch new updates
	const bot: TelegramBot = new TelegramBot(token, {polling: true});

	// Initialize the commands of the bot
	for (const command of commands) {
		bot.onText(command.regex, async (msg, match) => {
			await command.command(msg, match, bot, collection);
		});
	}

	bot.on("callback_query", async (query) => {
		const {userId, chatId, msgId, dropId, type} = parseQuery(query.data);

		const response: {message: string; drop: IDrop} = await queryTypes[type](userId, dropId, collection);
		bot.sendMessage(chatId, response.message, {
			disable_web_page_preview: true,
			parse_mode: "HTML",
		});
	});

	// Listen for any kind of message. There are different kinds of
	// messages.
	bot.on("message", (msg) => {
		const chatId = msg.chat.id;
		const user = msg.from;

		console.log(`\n👤 ${user.id} - ${user.first_name} ${user.last_name}\n✏️  ${msg.text}\n`);

		bot.sendChatAction(chatId, "typing");
	});

	setInterval(async () => {
		const drops: IDrop[] = (await collection.find({}).toArray()) as IDrop[];

		for (const drop of drops) {
			const refreshedDrop = await refreshDrop(drop.userId, drop.url, collection);
			if (!refreshedDrop.drop) continue;

			if (drop.isStocked !== refreshedDrop.drop.isStocked || drop.price.current !== refreshedDrop.drop.price.current) {
				bot.sendMessage(drop.userId, refreshedDrop.message, {
					disable_web_page_preview: true,
					parse_mode: "HTML",
				});
			}
		}
	}, 1000 * intervalSeconds);

	return "🚀 Client has been initiated correctly!";
})();

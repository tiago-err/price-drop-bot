import {Collection} from "mongodb";
import {Message} from "node-telegram-bot-api";
import TelegramBot = require("node-telegram-bot-api");
import addDrop from "../functions/add";

async function execute(message: Message, match: RegExpMatchArray, bot: TelegramBot, mongo: Collection) {
	const chatId = message.chat.id;

	const url = match[1].split(" ")[0];
	const size = match[1].split(" ")[1] || undefined;

	const response = await addDrop(message.from.id.toString(), {url, size}, mongo);
	bot.sendMessage(chatId, response.message, {
		disable_web_page_preview: true,
		parse_mode: "HTML",
	});
}

module.exports = execute;

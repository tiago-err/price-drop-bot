import {Collection} from "mongodb";
import {Message} from "node-telegram-bot-api";
import TelegramBot = require("node-telegram-bot-api");
import removeDrop from "../functions/remove";

async function execute(message: Message, match: RegExpMatchArray, bot: TelegramBot, mongo: Collection) {
	const chatId = message.chat.id;

	const response = await removeDrop(message.from.id.toString(), match[1], mongo);
	bot.sendMessage(chatId, response.message);
}

module.exports = execute;

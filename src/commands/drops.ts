import * as TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";
import {Collection} from "mongodb";

import {IDrop} from "../interfaces";
import display from "../functions/display";

async function execute(message: Message, match: RegExpMatchArray, bot: TelegramBot, mongo: Collection) {
	const chatId = message.chat.id;
	const user = message.from;

	const results: IDrop[] = (await mongo.find({userId: user.id.toString()}).toArray()) as IDrop[];
	if (!results) {
		bot.sendMessage(chatId, "❌ You don't have any single drop alert! Please use the `/alert` command to create a drop alert!");
		return;
	}

	for (const drop of results) {
		const message = await bot.sendMessage(chatId, display(drop), {
			disable_web_page_preview: true,
			parse_mode: "HTML",
		});

		const query = `u=${user.id}&c=${chatId}&d=${drop.id}&m=${message.message_id}`;

		await bot.editMessageReplyMarkup(
			{
				inline_keyboard: [
					[
						{
							text: "Remove",
							callback_data: `${query}&t=rm`,
						},
						{
							text: "Refresh",
							callback_data: `${query}&t=rf`,
						},
					],
				],
			},
			{message_id: message.message_id, chat_id: chatId},
		);
	}
}

module.exports = execute;

import {Collection} from "mongodb";
import {IDrop} from "../interfaces";
import {selectProvider} from "../scrapers/index";
import display from "./display";

export default async function execute(userId: string, item: {url: string; size?: string}, mongo: Collection) {
	const result: IDrop = (await mongo.findOne({userId, ...item})) as IDrop;
	if (result) {
		return {message: "❌ You already have created this drop alert!", drop: null};
	}

	const provider = selectProvider(item.url);
	if (!provider) {
		return {message: "❌ That URL is not from a valid provider!", drop: null};
	}

	const drop = await provider(item, userId);
	await mongo.insertOne(drop);

	return {message: display(drop), drop};
}

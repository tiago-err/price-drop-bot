import {Collection} from "mongodb";
import {IDrop} from "../interfaces";
import {selectProvider} from "../scrapers/index";
import display from "./display";

export default async function execute(userId: string, url: string, mongo: Collection): Promise<{message: string; drop: IDrop}> {
	const drop: IDrop = (await mongo.findOne({userId, url})) as IDrop;
	if (!drop) {
		return {message: "❌ Your item was not found on the drop list!", drop: null};
	}

	const provider = selectProvider(url);
	if (!provider) {
		return {message: "❌ That URL is not from a valid provider!", drop: null};
	}

	const updatedDrop = await provider({url, size: drop.size}, userId);
	Object.assign(drop, {price: updatedDrop.price, isStocked: updatedDrop.isStocked});

	await mongo.findOneAndReplace({id: drop.id}, drop);

	return {message: display(drop), drop};
}

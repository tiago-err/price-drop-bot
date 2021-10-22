import {Collection} from "mongodb";

import refreshDrop from "../functions/refresh";
import removeDrop from "../functions/remove";
import {IDrop} from "../interfaces";

export const queryTypes = {
	rm: async (userId: string, dropId: string, mongo: Collection): Promise<{message: string; drop: IDrop}> => {
		const drop: IDrop = (await mongo.findOne({userId, id: dropId})) as IDrop;
		if (!drop) {
			return {message: "❌ Your item was not found on the drop list!", drop: null};
		}

		return await removeDrop(userId, drop.url, mongo);
	},
	rf: async (userId: string, dropId: string, mongo: Collection): Promise<{message: string; drop: IDrop}> => {
		const drop: IDrop = (await mongo.findOne({userId, id: dropId})) as IDrop;

		if (!drop) {
			return {message: "❌ Your item was not found on the drop list!", drop: null};
		}

		return await refreshDrop(userId, drop.url, mongo);
	},
};

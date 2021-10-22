import {Collection} from "mongodb";

export default async function execute(userId: string, url: string, mongo: Collection) {
	const response = await mongo.findOneAndDelete({userId, url});
	if (response.ok) {
		return {message: "✅ Your item has been removed from the drop list!", drop: null};
	}
	return {message: "❌ Your item was not found on the drop list!", drop: null};
}

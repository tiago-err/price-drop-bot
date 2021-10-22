interface IQuery {
	userId: string;
	chatId: string;
	msgId: string;
	dropId: string;
	type: string;
}

export function parseQuery(query: string): IQuery {
	const parsedQuery = {
		userId: "",
		chatId: "",
		msgId: "",
		dropId: "",
		type: "",
	};

	const items = query.split("&");
	for (const item of items) {
		const pair = item.split("=");

		switch (pair[0]) {
			case "u":
				parsedQuery.userId = pair[1];
				break;
			case "c":
				parsedQuery.chatId = pair[1];
				break;
			case "m":
				parsedQuery.msgId = pair[1];
				break;
			case "d":
				parsedQuery.dropId = pair[1];
				break;
			case "t":
				parsedQuery.type = pair[1];
				break;
		}
	}

	return parsedQuery;
}

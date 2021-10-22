import {IDrop} from "../interfaces";
import matilda from "./matilda";
import zara from "./zara";

const providers = [
	{
		regex: /(.*)matildajewellery.com\/products\/(.+)/,
		function: matilda,
	},
	{
		regex: /(.*)zara.com\/pt\/(.+)/,
		function: zara,
	},
];

export function selectProvider(url): (item: {url: string; size?: string}, userId: string) => Promise<IDrop> {
	for (const provider of providers) {
		if (provider.regex.test(url)) return provider.function;
	}

	return undefined;
}

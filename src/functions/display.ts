import {IDrop} from "../interfaces";

export default function display(drop: IDrop) {
	let dropMessage = `<b>${drop.item}${drop.size ? ` - ${drop.size}` : ""}</b>\n${drop.url}\n\n<u>Original Price:</u> ${
		drop.price.original
	}€\n<u>Current Price:</u> ${drop.price.current}€`;

	if (!drop.isStocked) dropMessage += `\n\n❌  [Out of Stock]`;
	if (drop.isStocked) dropMessage += `\n\n✅  [In Stock]`;

	if (drop.price.current < drop.price.original)
		dropMessage += `\n\n🛍️  [~${Math.round((drop.price.current * 100) / drop.price.original)}% discount]`;

	return dropMessage;
}

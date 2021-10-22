import cheerio from "cheerio";
import {IDrop} from "../interfaces";
import * as shortUUID from "short-uuid";
import {getPageHtml} from "../utils/html";

export default async (item: {url: string; size?: string}, userId): Promise<IDrop> => {
	const $ = cheerio.load(await getPageHtml("axios", item.url));

	const title = $(".product-single__meta > h1").text();
	const originalPrice = $(".product-single__meta .price__regular .price-item--regular").text().trim();
	const currentPrice = $(".product-single__meta .price__sale .price-item--sale").text().trim();

	const isStocked = !$(".product-single__meta .product__price .price").hasClass("price--sold-out");

	return {
		id: shortUUID.generate(),
		userId,
		url: item.url,
		item: title,
		price: {
			original: parseFloat(originalPrice.replace(/[^\w,\.]/g, "")),
			current: parseFloat(currentPrice.replace(/[^\w,\.]/g, "")),
		},
		isStocked,
	};
};

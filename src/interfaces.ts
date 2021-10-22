export interface IDrop {
	userId: string;
	id: string;
	item: string;
	size?: string;
	url: string;
	price: {
		original: number;
		current: number;
	};
	isStocked: boolean;
}

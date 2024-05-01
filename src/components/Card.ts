interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export interface IItemCard {
	id: ItemID;
	title: string;
	price: number;
	description?: string;
	image?: string;
	category?: Category;
	index?: number;
	isAdded: boolean;
}

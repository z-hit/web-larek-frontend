import { Api } from './base/api';
import {
	IOrder,
	IItem,
	IOrderResult,
	ILarekAPI,
	ApiListResponse,
} from '../types';

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItem(id: string): Promise<IItem> {
		return this.get(`/product/${id}`).then((item: IItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getItemList(): Promise<IItem[]> {
		return this.get('/product/').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderItems(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}

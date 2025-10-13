export type orderSize = 'S' | 'M' | 'L' | 'XL';

export interface OrderDetail{
    id: string,
    orderId: string,
    garmentId: string,
    size: orderSize,
    sex: 'F' | 'M',
    quantity: number,
    subtotal: number,
}
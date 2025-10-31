import { vi } from "vitest";
import type { OrderDetailService } from "../services/order-detail-service";
import type { OrderDetail } from "../entities/OrderDetail";

export const mockOrderDetailService = (
    orderDetails: OrderDetail[] = []
): OrderDetailService => {
    return {
        saveMany: vi.fn().mockImplementation(async (details: Omit<OrderDetail,'id'>[]) => {
            const savedDetails = details.map((detail, index) => ({
                id: (orderDetails.length + index + 1).toString(),
                ...detail
            }));
            orderDetails.push(...(savedDetails as OrderDetail[]));
            return savedDetails as OrderDetail[];
        })
    }
}
    
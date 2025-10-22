import request from 'supertest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { OrderStatus } from '@/domain/entities/Order';
import { app } from '../app';


describe('Order Routes', () => {
  let OrderModel: any;

  
  describe('POST /orders', () => {
    const validOrderData = {
      customerId: new mongoose.Types.ObjectId().toString(),
      employeeId: new mongoose.Types.ObjectId().toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      garments: [
        {
          garmentId: new mongoose.Types.ObjectId().toString(),
          quantity: 2,
          price: 50,
          size: 'M',
          sex: 'M',
        },
      ],
    };

    it('should create a new order successfully', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        customerId: validOrderData.customerId,
        employeeId: validOrderData.employeeId,
        status: OrderStatus.Pending,
        orderDetails: expect.arrayContaining([
          expect.objectContaining({
            garmentId: validOrderData.garments[0].garmentId,
            quantity: validOrderData.garments[0].quantity,
            price: validOrderData.garments[0].price,
          }),
        ]),
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('api/orders')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 if garments array is empty', async () => {
      const invalidData = { ...validOrderData, garments: [] };
      
      const response = await request(app)
        .post('/orders')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Order must contain at least one garment');
    });
  });

  describe('POST /orders/assign', () => {
    it('should assign an order to an employee successfully', async () => {
      // First create an order
      const order = await OrderModel.create({
        customerId: new mongoose.Types.ObjectId(),
        employeeId: new mongoose.Types.ObjectId(),
        status: OrderStatus.Pending,
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        orderDetails: [],
        totalPrice: 100,
      });

      const employeeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .post('/orders/assign')
        .send({
          orderId: order._id.toString(),
          employeeId,
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: order._id.toString(),
        employeeId,
        status: OrderStatus.InProcess,
      });
    });

    it('should return 400 if orderId or employeeId is missing', async () => {
      const response = await request(app)
        .post('/orders/assign')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });
  });

  describe('GET /orders/:id', () => {
    it('should return an order by id', async () => {
      const order = await OrderModel.create({
        customerId: new mongoose.Types.ObjectId(),
        employeeId: new mongoose.Types.ObjectId(),
        status: OrderStatus.Pending,
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        orderDetails: [],
        totalPrice: 100,
      });

      const response = await request(app)
        .get(`/orders/${order._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', order._id.toString());
    });

    it('should return 400 if order id is invalid', async () => {
      const response = await request(app)
        .get('/orders/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid order ID');
    });
  });

  

  describe('GET /orders/employee/:employeeId', () => {
    it('should return orders for an employee', async () => {
      const employeeId = new mongoose.Types.ObjectId();
      
      // Create test orders
      await OrderModel.create([
        {
          customerId: new mongoose.Types.ObjectId(),
          employeeId,
          status: OrderStatus.InProcess,
          orderDate: new Date(),
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          orderDetails: [],
          totalPrice: 150,
        },
        {
          customerId: new mongoose.Types.ObjectId(),
          employeeId,
          status: OrderStatus.Completed,
          orderDate: new Date(),
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          orderDetails: [],
          totalPrice: 250,
        },
      ]);

      const response = await request(app)
        .get(`/orders/employee/${employeeId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach((order: any) => {
        expect(order.employeeId).toBe(employeeId.toString());
      });
    });
  });
});

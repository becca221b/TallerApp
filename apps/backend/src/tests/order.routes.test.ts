import request from 'supertest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { OrderStatus } from '@/domain/entities/Order';
import { app } from '../app';
import { GarmentModel } from '../models/GarmentModel';
import { OrderModel } from 'src/models/OrderModel';

beforeEach(async () => {
  // Clear the database
  await GarmentModel.deleteMany({});
  
  // Create test garment
  const garmentId = "676641152221222122212221";
  await GarmentModel.create({
    _id: new mongoose.Types.ObjectId(garmentId),
    id: garmentId,
    name: "shirt",
    price: 50,
    color: "Red",
    description: "Test garment",
    imageUrl: "https://example.com/test-garment.jpg",
    neck: "Round",
    cuff: "Long",
    flap: "Long",
    zipper: "Long",
    pocket: "Long",
    waist: "Long"
  });

  
});

describe('Order Routes', () => {

  describe('POST /orders', () => {
    const validOrderData = {
      customerId: "676641152221222122212221",
      employeeId: "676141152221222122212221",
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      garments: [
        {
          garmentId: "676641152221222122212221",
          quantity: 2,
          price: 50,
          size: 'M',
          sex: 'M',
          subtotal: 100
        },
      ],
      orderDate: new Date()
    };

    it('should create a new order successfully', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message: 'Order created successfully',
        order: {
          customerId: validOrderData.customerId,
          employeeId: validOrderData.employeeId,
          status: OrderStatus.Pending,
          orderDetails: expect.arrayContaining([
            expect.objectContaining({
              garmentId: validOrderData.garments[0].garmentId,
              quantity: validOrderData.garments[0].quantity,
              subtotal: validOrderData.garments[0].subtotal,
              size: validOrderData.garments[0].size,
              sex: validOrderData.garments[0].sex
            })
          ])
        }
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 if garments array is empty', async () => {
      const invalidData = { ...validOrderData, garments: [] };
      
      const response = await request(app)
        .post('/api/orders')
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/orders/assign', () => {
    it('should assign an order to an employee successfully', async () => {
      // First create an order
      
      const order = {
        id: "676641152221222122212221",
        customerId: "676641152221222122212221",
        employeeId: "676141152221222122212221",
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        garments: [
          {
            garmentId: "676641152221222122212221",
            quantity: 2,
            price: 50,
            size: 'M',
            sex: 'M',
            subtotal: 100
          },
        ],
        orderDate: new Date()
      };

      const supervisorId = new mongoose.Types.ObjectId().toString();
      
      const employeeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .post('/api/orders/assign')
        .send({
          orderId: order.id.toString(),
          employeeId,
          supervisorId
        });

      console.log('Response status:', response.status);
      console.log('Response body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: order.id.toString(),
        employeeId,
        status: OrderStatus.InProcess,
      });
    });

    it('should return 400 if orderId or employeeId is missing', async () => {
      const response = await request(app)
        .post('/api/orders/assign')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
    });
  });
/*
  describe('GET /api/orders/:id', () => {
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
        .get(`/api/orders/${order._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', order._id.toString());
    });

    it('should return 400 if order id is invalid', async () => {
      const response = await request(app)
        .get('/api/orders/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid order ID');
    });
  });

  

  describe('GET /api/orders/employee/:employeeId', () => {
    it('should return orders for an employee', async () => {
      const employeeId = '676641152221222122212221';
      
      // Create test orders
      await OrderModel.create([
        {
          customerId: '676641152221222122212221',
          employeeId,
          status: OrderStatus.Pending,
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
        .get(`/api/orders/employee/${employeeId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach((order: any) => {
        expect(order.employeeId).toBe(employeeId.toString());
      });
    });
  });*/
});

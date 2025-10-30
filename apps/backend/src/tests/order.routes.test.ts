import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { OrderStatus } from '@/domain/entities/Order';
import { app } from '../app';
import { GarmentModel } from '../models/GarmentModel';
import { OrderModel } from '../models/OrderModel';
import { EmployeeModel } from '../models/EmployeeModel';
import { mongoose } from './setup';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
let supervisorToken: string;
let costureroToken: string;

beforeEach(async () => {
  // Clear all collections
  beforeEach(async () => {
  await EmployeeModel.deleteMany({});
  await OrderModel.deleteMany({});
  await GarmentModel.deleteMany({});
  });

  // Crear supervisor (rol con permisos para crear y asignar órdenes)
  const supervisor = await EmployeeModel.create({
    name: 'Supervisor',
    surname: 'Test',
    documentNumber: '87654321',
    phone: '1234567890',
    employeeType: 'Supervisor',
    username: 'supervisor.test',
    password: 'hashedpass',
    isActive: true,
    email: 'supervisor@test.com',
    address: '123 Main St'
  });

  supervisorToken = jwt.sign(
    { id: supervisor._id, role: 'Supervisor', username: supervisor.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Crear costurero (rol que solo puede actualizar o ver órdenes propias)
  const costurero = await EmployeeModel.create({
    name: 'Costurero',
    surname: 'Test',
    documentNumber: '12345678',
    phone: '1234567890',
    employeeType: 'Costurero',
    username: 'costurero.test',
    password: 'hashedpass',
    isActive: true,
    email: 'costurero@test.com',
    address: '456 Side St'
  });

  costureroToken = jwt.sign(
    { id: costurero._id, role: 'Costurero', username: costurero.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

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
        .set('Authorization', `Bearer ${supervisorToken}`)
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

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token provided');
    });

    it('should return 403 if user role is not allowed', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${costureroToken}`) // costurero no puede crear
        .send(validOrderData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 if garments array is empty', async () => {
      const invalidData = { ...validOrderData, garments: [] };
      
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/orders/assign', () => {
    it('should assign an order to an employee successfully', async () => {
      // First, create a test supervisor
      const supervisorData = {
        id: new mongoose.Types.ObjectId().toString(),
        name: 'Test',
        surname: 'Supervisor',
        documentNumber: '87654321',
        phone: '1234567890',
        employeeType: 'Supervisor',  
        username: 'test.supervisor',
        password: 'test123',
        isActive: true,  
        email: 'supervisor@test.com',
        address: '123 Test St'
      };
      const supervisor = await EmployeeModel.create(supervisorData);
      

      // Create a test order
      const pendingOrder = await OrderModel.create({
            customerId: 'customer123',
            employeeId: '',
            orderDate: new Date(),
            status: OrderStatus.Pending,
            totalPrice: 100,
            orderDetails: [],
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      
      // Create a test employee (Costurero)
      const employeeData = {
        id: new mongoose.Types.ObjectId().toString(),
        name: 'Test',
        surname: 'Employee',
        documentNumber: '12345678',
        phone: '1234567890',
        employeeType: 'Costurero',  // Must be 'Costurero' as per validation
        username: 'test.employee',
        password: 'test123',
        isActive: true,  // Must be active
        email: 'employee@test.com',
        address: '456 Employee St'
      };  
      const employee = await EmployeeModel.create(employeeData);
      
      const response = await request(app)
        .post('/api/orders/assign')
        .send({
          orderId: pendingOrder._id.toString(),
          employeeId: employee._id.toString(),
          assignedBySupervisorId: supervisor._id.toString(),
        });

      // Log the response body if status is not 200
      if (response.status !== 200) {
        console.log('Error response:', JSON.stringify(response.body, null, 2));
      }
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Order assigned successfully');
      expect(response.body).toHaveProperty('order');
      expect(response.body.order).toHaveProperty('id', pendingOrder._id.toString());
      expect(response.body.order).toHaveProperty('employeeId', employee._id.toString());
      expect(response.body.order).toHaveProperty('status', OrderStatus.InProcess);
    });
    
  
    it('should return 400 if orderId or employeeId is missing', async () => {
      const response = await request(app)
        .post('/api/orders/assign')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Supervisor not found');
    });
  });
  

  //Obtener ordenes de un empleado
  describe('GET /api/orders/employee/:employeeId', () => {
    it('should return orders for an employee', async () => {
      const fakeEmployeeId = '676641152221222122212221';
      
      // Create test orders
      await OrderModel.create([
        {
          customerId: '676641152221222122212221',
          employeeId: fakeEmployeeId,
          status: OrderStatus.Pending,
          orderDate: new Date(),
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          orderDetails: [],
          totalPrice: 150,
        },
        {
          customerId: new mongoose.Types.ObjectId(),
          employeeId: fakeEmployeeId,
          status: OrderStatus.Completed,
          orderDate: new Date(),
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          orderDetails: [],
          totalPrice: 250,
        },
      ]);

      const response = await request(app)
        .get(`/api/orders/employee/${fakeEmployeeId}`);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders.length).toBe(2);
      response.body.orders.forEach((order: any) => {
        expect(order.employeeId).toBe(fakeEmployeeId.toString());
      });
    });
  });

  //Actualizar estado de una orden
  describe('POST /api/orders/update-status', () => {
    it('should update the status of an order', async () => {

       // Create a test employee (Costurero)
      const employeeData = {
        id: new mongoose.Types.ObjectId().toString(),
        name: 'Test',
        surname: 'Employee',
        documentNumber: '12345678',
        phone: '1234567890',
        employeeType: 'Costurero',  // Must be 'Costurero' as per validation
        username: 'test.employee',
        password: 'test123',
        isActive: true,  // Must be active
        email: 'employee@test.com',
        address: '456 Employee St'
      };  
      const employee = await EmployeeModel.create(employeeData);
      // Create a test order
      const pendingOrder = await OrderModel.create({
            customerId: 'customer123',
            employeeId: employee._id.toString(),
            orderDate: new Date(),
            status: OrderStatus.Pending,
            totalPrice: 100,
            orderDetails: [],
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      
     
      const fakeNewStatus = OrderStatus.InProcess;
      
      const response = await request(app)
        .post('/api/orders/update-status')
        .send({
          orderId: pendingOrder._id.toString(),
          newStatus: fakeNewStatus,
          employeeId: employee._id.toString(),
        });
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Order status updated successfully');
       expect(response.body).toHaveProperty('order');
      expect(response.body.order).toHaveProperty('id', pendingOrder._id.toString());
      expect(response.body.order).toHaveProperty('status', fakeNewStatus);
    });
  });
 
});

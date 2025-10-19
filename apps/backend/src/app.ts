import express from "express";
import cors from "cors";
require('dotenv').config();
import { authRoutes } from "./routes/auth.routes";
import { orderRoutes } from "./routes/order.routes";
import { customerRoutes } from "./routes/customer.routes";
import { authController } from "./controllers/auth.controller";
import { orderController } from "./controllers/order.controller";
import { customerController } from "./controllers/customer.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { connectDB } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(); // connect to Mongo

  // Initialize repositories
  const userRepository = new UserRepository();
  const customerRepository = new CustomerRepository();
  const orderRepository = new OrderRepository();

  // Initialize services
  const authService = new AuthService(userRepository);

  // Initialize controllers
  const authController = new AuthController(authService);
  const orderController = new OrderController(orderRepository, customerRepository);
  const customerController = new CustomerController(customerRepository);

  // Initialize middleware
  const authMiddleware = new AuthMiddleware(authService, userRepository);

//Routes
app.use("/api/auth", authRoutes(authController));
app.use("api/orders", orderRoutes(orderController, authMiddleware));
app.use("api/customers", customerRoutes(customerController, authMiddleware));


// Middleware error 404 for any other routes
app.use('*',(req, res) => {
    res.status(404).json({ error: 'Ouch!! That route does not exist.' });
});


export { app };
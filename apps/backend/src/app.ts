import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import customerRoutes from "./routes/customer.routes";
import employeeRoutes from "./routes/employee.routes";


const app = express();

// Configure CORS with specific origin and credentials support
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);

//Test endpoint
app.get("/", (req, res) => res.json({ ok: true, message: "Backend de TallerApp" }));
// Middleware error 404 for any other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Ouch!! That route does not exist.' });
});


export { app };
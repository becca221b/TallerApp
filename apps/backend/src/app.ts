import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
//import customerRoutes from "./routes/customer.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
//app.use("api/customers", customerRoutes);

//Test endpoint
app.get("/", (req, res) => res.json({ ok: true, message: "Backend de TallerApp" }));
// Middleware error 404 for any other routes
app.use((req, res) => {
    res.status(404).json({ error: 'Ouch!! That route does not exist.' });
});


export { app };
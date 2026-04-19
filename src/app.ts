import express from "express";
import router from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors({
        origin: process.env.APP_URL || "http://localhost:4000",
        credentials: true
}))

app.use(express.json());
app.use(morgan("dev"));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/post", router);
app.use("/gets", router);



app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export default app;
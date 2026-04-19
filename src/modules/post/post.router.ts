import express from 'express';
import { auth, UserRoles } from "../../middlewares/auth";
import { postController } from "./post.controller";
 

const router = express.Router();


router.post("/", auth(UserRoles.USER), postController.createPost);     

router.get("/", postController.getAllPosts);

export default router;  
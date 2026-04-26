import express from 'express';
import { CommentController } from './comment.controller';
import { auth } from "../../middlewares/auth";
import { UserRoles } from '../../middlewares/auth';
const router = express.Router();

router.post("/:id", auth(UserRoles.USER, UserRoles.ADMIN), CommentController.createComment);
router.get("/:commentId", CommentController.getCommentById)
router.get("/author/:authorId", CommentController.getCommentByAuthorId)
router.delete("/:commentId", auth(UserRoles.ADMIN, UserRoles.USER), CommentController.deletComment)
router.patch("/:commentId", auth(UserRoles.ADMIN, UserRoles.USER), CommentController.updateComment)

export default router;
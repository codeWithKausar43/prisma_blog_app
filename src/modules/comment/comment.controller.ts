import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    req.body.authorId = req.user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentById(commentId as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "comment fetch field" });
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentByAuthorId(
      authorId as string,
    );
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletComment = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const {commentId} = req.params 
    const result = await CommentService.deletComment(commentId as string, user?.id as string);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: "comment delet field" });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const {commentId} = req.params 
    const result = await CommentService.updateComment(commentId as string, req.body, user?.id as string);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: "comment update field" });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deletComment,
  updateComment
};

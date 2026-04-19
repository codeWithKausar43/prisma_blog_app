import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await postService.createPost(
      req.body,
      req.user!.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    console.log("Search query:", search);
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const status = req.query.status as PostStatus | undefined;
    const isFeatured =
      req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined;

    console.log({ isFeatured });

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      page, 
      limit,
      skip
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postController = {
  createPost,
  getAllPosts,
};

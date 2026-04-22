import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import pagginationSortingHelper from "../../helpers/pagginationSortingHelper";

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

    const { page, limit, skip, sortBy, sortOrder } = pagginationSortingHelper(req.query)
 
    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      page, 
      limit,
      skip,
      sortBy,
      sortOrder
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

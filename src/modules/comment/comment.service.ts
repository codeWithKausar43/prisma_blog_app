import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (Payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  return await prisma.comment.create({
    data: Payload,
  });
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true
        },
      },
    },
  });
  return result;
};

const getCommentByAuthorId = async (authorId: string) =>{
 const result = await prisma.comment.findMany({
  where: {
    authorId
  }, 
  orderBy: {createdAt: "desc"}, 
  include: {
    post: {
      select: {
        id: true,
        title: true
      }
    }
  }
 })
 return result
}

const deletComment = async (commentId: string, authorId:string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId
    },
    select: {
      id: true
    }
  })
 if(!commentData){
  throw new Error("your input is invalid")
 }
const result = await prisma.comment.delete({
    where: {
      id: commentId
    }
  })
  return result
}

const updateComment = async (commentId: string, data: {content: string, status: CommentStatus}, authorId: string) => {
 const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId
    },
    select: {
      id: true
    }
  })
 if(!commentData){
  throw new Error("your input is invalid")
 }

 return await prisma.comment.update({
  where: {
    id: commentId, 
    authorId
  },
  data
 })
                      
}

export const CommentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId, 
  deletComment, 
  updateComment
};

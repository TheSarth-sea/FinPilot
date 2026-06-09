import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { message } = req.body;

  return res.status(200).json({
    success: true,
    response: `You said: ${message}`,
  });
};

export const getChatHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    history: [],
  });
};
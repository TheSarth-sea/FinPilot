import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { message } = req.body;

    return res.status(200).json({
      success: true,
      message: "Chat response generated",
      response: `You said: ${message}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Chat service error",
    });
  }
};

export const getChatHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    return res.status(200).json({
      success: true,
      history: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};

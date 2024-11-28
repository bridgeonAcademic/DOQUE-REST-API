import Chat from "../models/chatModel";
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
export const app = express();

export const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
	},
});

io.on("connection", async (socket) => {
	if (process.env.NODE_ENV === "development") console.log("User connected");

	socket.on("joinWorkspace", (workSpaceId) => {
		socket.join(workSpaceId);
		if (process.env.NODE_ENV === "development") console.log(`User joined workspace: ${workSpaceId}`);
	});

	socket.on("sendMessage", async (message) => {
		try {
			const chat = await Chat.findOne({ workspaceId: message?.workSpaceId });

			if (chat) {
				chat.messages.push({
					content: message?.content,
					timestamp: Date.now(),
					sender: message?.sender,
				});

				const updatedChat = await chat.save();
				const populatedChat = await updatedChat.populate("messages.sender");

				io.to(message?.workSpaceId).emit("receiveMessage", populatedChat);
			} else {
				const newChat = new Chat({
					workspaceId: message?.workSpaceId,
					messages: [
						{
							content: message?.content,
							timestamp: Date.now(),
							sender: message?.sender,
						},
					],
				});

				const savedMessage = await (await newChat.save()).populate("messages.sender");
				io.to(message?.workSpaceId).emit("receiveMessage", savedMessage);
			}
		} catch (err) {
			console.error("Error saving message to database:", err);
		}
	});

	socket.on("disconnect", () => {
		if (process.env.NODE_ENV === "development") console.log("User disconnected");
	});
});

import Chat from "../models/chatModel";
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";

export const app = express();

export const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", async (socket) => {
	console.log("A user connected");

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

				io.emit("receiveMessage", populatedChat);
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
				io.emit("receiveMessage", savedMessage);
			}
		} catch (err) {
			console.error("Error saving message to database:", err);
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

// Setup a simple Socket.io server
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

io.on("connection", socket => {
	console.log("Connected");

	socket.on("message", message => {
		// Broadcast the message to all connected clients excluding the sender
		socket.broadcast.emit("message", message);
	});

	socket.on("disconnect", () => {
		console.log("Disconnected");
	});
});

httpServer.listen(3001, () => {
	console.log("Listening on :3001");
});

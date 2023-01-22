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
	console.log("a user connected");

	socket.on("message", message => {
		// Broadcast the message to all connected clients
		io.emit("message", message);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

httpServer.listen(3001, () => {
	console.log("listening on *:3001");
});

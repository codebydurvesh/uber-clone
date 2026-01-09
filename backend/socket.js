import { Server } from "socket.io";
import { User } from "./models/user.model.js";
import { Captain } from "./models/captain.model.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle user joining (store socketId)
    socket.on("join", async (data) => {
      console.log("Join event received:", data);
      const { userId, userType } = data;

      if (userType === "user") {
        await User.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log(`User ${userId} joined with socket ${socket.id}`);
      } else if (userType === "captain") {
        await Captain.findByIdAndUpdate(userId, {
          socketId: socket.id,
          status: "active",
        });
        // Store the login timestamp on the socket for filtering old rides
        socket.captainLoginTime = new Date();
        socket.captainId = userId;
        console.log(`Captain ${userId} joined with socket ${socket.id}`);
      }
    });

    // Handle captain updating location
    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await Captain.findByIdAndUpdate(userId, {
        location: {
          latitude: location.lat,
          longitude: location.lng,
        },
      });
    });

    // Handle live location updates during ride
    socket.on("update-location", async (data) => {
      const { rideId, userType, location } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      // Broadcast location to all connected clients with the same rideId
      socket.broadcast.emit("location-update", {
        rideId,
        userType,
        location,
      });
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Mark captain as inactive when they disconnect
      if (socket.captainId) {
        await Captain.findByIdAndUpdate(socket.captainId, {
          status: "inactive",
        });
      }
    });
  });

  return io;
};

// Send message to a specific socket
export const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized");
  }
};

// Broadcast new ride to all active captains
export const broadcastNewRide = (rideData) => {
  if (io) {
    console.log("Broadcasting new ride to captains...");
    // Get all connected sockets
    const sockets = io.sockets.sockets;
    let captainCount = 0;

    sockets.forEach((socket) => {
      // Send to all connected captains
      if (socket.captainId) {
        console.log(`Sending ride to captain ${socket.captainId}`);
        socket.emit("new-ride", rideData);
        captainCount++;
      }
    });

    console.log(`Ride broadcast to ${captainCount} captain(s)`);
  } else {
    console.log("Socket.io not initialized");
  }
};

export { io };

import { io } from "socket.io-client";
import { backendURL } from "./api";

export const socket = io(backendURL);
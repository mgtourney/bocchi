import ioClient from "socket.io-client"
import { Client } from "tournament-assistant-client";
const ENDPOINT = "http://127.0.0.1:3000"
const TA_URL = "ws://tournamentassistant.net:2053"

const socket = ioClient(ENDPOINT)

const taClient = new Client("Magnesium Overlay", {
   url: TA_URL
});

export const ta = taClient
export const io = socket
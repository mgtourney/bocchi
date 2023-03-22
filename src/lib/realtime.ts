import ioClient from "socket.io-client"
import { Client } from "tournament-assistant-client";
const ENDPOINT = "http://127.0.0.1:3000"
const TA_URL = "ws://ta.magnesium.gg:32001"

const socket = ioClient(ENDPOINT)

const taClient = new Client("Magnesium Overlay", {
    url: TA_URL
});

export const ta = taClient
export const io = socket
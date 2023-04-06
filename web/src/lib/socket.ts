import ioClient from 'socket.io-client';
const ENDPOINT = "https://socket.magnesium.gg"

const socket = ioClient(ENDPOINT)
export const io = socket
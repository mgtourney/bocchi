import ioClient from 'socket.io-client';
const ENDPOINT = "http://127.0.0.1:3000"

const socket = ioClient(ENDPOINT)
export const io = socket
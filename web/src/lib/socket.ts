import ioClient from 'socket.io-client';
const ENDPOINT = "http://localhost:3173";

const socket = ioClient(ENDPOINT)
export const io = socket
import { Server, Socket } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket-types';

export class SocketServer {
  server: Server;
  sockets: Array<Socket> = [];

  constructor(port: number) {
    this.server = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(port);

    this.server.on('connection', (socket) => {
      // HERE SERVER GO BRRRRRRRRR
    })
  }
}

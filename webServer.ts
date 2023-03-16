import { Server, ServerOptions } from 'socket.io'

export const webSocketServer = {
  name: 'webSocketServer',
  configureServer(server: { httpServer: Partial<ServerOptions> | undefined }) {
    const io = new Server(server.httpServer)

    io.on("connect", (socket) => {
      socket.emit('eventFromServer', 'Hello, World!')
    })
  }
}

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from 'socket.io';

let lastScene = {
  type: "ChangeScene",
  page: "starting-soon",
  data: {}
};

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      name: 'sveltekit-socket-io',
      configureServer() {
        const io = new Server(3000, {
          'cors': {
            origin: '*', // Dev workaround
          }
        });

        io.on('connection', (socket) => {
          socket.on('message', (message) => {
            if (message.type === "ChangeScene") {
              lastScene = message;
            }
            socket.broadcast.emit('message', message);
          })
          socket.on('gotoCurrentScene', () => {
            socket.emit('message', lastScene);
          })
        })

        console.log('SocketIO injected');
      }
    }
  ]
});

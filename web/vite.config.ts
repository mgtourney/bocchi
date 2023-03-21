import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from 'socket.io';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socket-io',
			configureServer() {
				const io = new Server(3000, {
					'cors': {
						origin: '*',
					}
				});

				io.on('connection', (socket) => {
					socket.on('message', (message) => {
						socket.broadcast.emit('message', message)
					})
				})

				console.log('SocketIO injected');
			}
		}
	]
});

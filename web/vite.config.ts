import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import Relay from './Relay';


export default defineConfig({
  plugins: [
    sveltekit(),
    // {
    //   name: 'sveltekit-socket-io',
    //   configureServer() {
    //     const relayServer = new Relay();
    //   }
    // }
  ]
});




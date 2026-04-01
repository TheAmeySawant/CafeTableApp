import Pusher from 'pusher-js';

// Setup Pusher client
// We use a singleton pattern so we don't create multiple connections in React
let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (typeof window === 'undefined') return null;
  
  if (!pusherClient) {
    // In production these should be actual env keys
    // We fall back to standard dev keys for local testing if env is missing
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'your_pusher_key';
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2';
    
    pusherClient = new Pusher(key, {
      cluster: cluster,
    });
  }
  
  return pusherClient;
};

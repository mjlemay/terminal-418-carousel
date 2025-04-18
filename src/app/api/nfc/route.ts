import { WebSocketServer } from 'ws';
import { NextResponse } from 'next/server';
import { Server } from 'http';
// import { NFC } from 'nfc-pcsc';

// // Create an instance of NFC
// const nfc = new NFC();

// Create a WebSocket server
let wss: WebSocketServer;

// Initialize WebSocket server
const initWebSocketServer = (server: Server) => {
  wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    // Handle NFC reader events
    // nfc.on('reader', (reader) => {
    //   console.log(`Reader detected: ${reader.reader.name}`);

    //   // Handle card detection
    //   reader.on('card', (card) => {
    //     console.log(`Card detected: ${card.uid}`);
    //     ws.send(JSON.stringify({ uid: card.uid }));
    //   });

    //   // Handle errors
    //   reader.on('error', (err) => {
    //     console.error(`Reader error: ${err}`);
    //   });

    //   // Handle reader disconnection
    //   reader.on('end', () => {
    //     console.log(`Reader disconnected: ${reader.reader.name}`);
    //   });
    // });

    // // Handle NFC initialization errors
    // nfc.on('error', (err) => {
    //   console.error(`NFC error: ${err}`);
    // });
  });

  // Attach WebSocket server to the HTTP server
  server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request received');
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
};

// API route handler
export async function GET() {
  return NextResponse.json({ message: 'WebSocket server initialized' });
}

// Attach WebSocket server to the HTTP server
export const dynamic = 'force-dynamic'; // Ensure the route is dynamically rendered
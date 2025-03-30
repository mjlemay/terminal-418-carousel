declare module 'nfc-pcsc' {
    import { EventEmitter } from 'events';
  
    export interface Card {
      atr: Buffer;
      standard: string;
      type: string;
      uid: string;
    }
  
    export interface Reader {
      reader: {
        name: string;
      };
      on(event: 'card', listener: (card: Card) => void): this;
      on(event: 'card.off', listener: (card: Card) => void): this;
      on(event: 'error', listener: (error: Error) => void): this;
      on(event: 'end', listener: () => void): this;
      disconnect(): Promise<void>;
    }
  
    export class NFC extends EventEmitter {
      on(event: 'reader', listener: (reader: Reader) => void): this;
      on(event: 'error', listener: (error: Error) => void): this;
    }
  }
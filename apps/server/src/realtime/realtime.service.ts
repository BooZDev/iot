import { Injectable } from '@nestjs/common';

@Injectable()
export class RealtimeService {
  private lastMessage: {
    event: string;
    message: {
      temp: number;
      hum: number;
      gasLever: number;
      lightCurrent: number;
    };
  } | null = null;

  setLastMessage(
    event: string,
    message: {
      temp: number;
      hum: number;
      gasLever: number;
      lightCurrent: number;
    },
  ) {
    this.lastMessage = { event, message };
  }

  getLastMessage() {
    return this.lastMessage;
  }
}

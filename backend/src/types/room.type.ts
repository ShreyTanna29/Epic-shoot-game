import { Player } from './player.type';
import WebSocket from 'ws';

export type Room = {
  id: number;
  player1Details: Player;
  player2Details: Player;
  player1Client: WebSocket;
  player2Client: WebSocket;
  intervalId: NodeJS.Timeout | null;
};

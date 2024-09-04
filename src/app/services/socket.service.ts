import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private apiUrl: string = environment.apiUrl;
  private socket: Socket;

  constructor() {
    this.socket = io(this.apiUrl);
  }

  getSocket(): Socket {
    return this.socket;
  }
}

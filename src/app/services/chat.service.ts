import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from './socket.service';
import { Message } from '../models/message';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl: string = environment.apiUrl + "/api";
  private messagesSubject = new Subject<Message>();

  constructor(private http: HttpClient, private socketService: SocketService) {
    const socket = this.socketService.getSocket();

    socket.on('newMessage', (message: Message) => {
      this.messagesSubject.next(message);
    });
  }

  getMessages() {
    return this.messagesSubject.asObservable();
  }

  getActiveUsers(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl + '/active-users');
  }

  joinRoom(roomCode: string, username: string): void {
    const socket = this.socketService.getSocket();
    socket.emit('joinRoom', {roomCode, username});
  }
  
  createRoom(room: string): void {
    const socket = this.socketService.getSocket();
    socket.emit('createRoom', room);
  }

  getChatrooms(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/chatrooms/${username}`);
  }

  getChatHistory(identifier: string, type: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chats/${identifier}/messages?type=${type}`);
  }  
  
  sendMessage(message: Message, chatIdentifier: string, chatType: string): void {
    const socket = this.socketService.getSocket();
    socket.emit('sendMessage', { message, chatIdentifier, chatType });
  }
  
  getPreviousChats(username: string): Observable<{ userChats: string[], roomChats: string[] }> {
    return this.http.get<{ userChats: string[], roomChats: string[] }>(`${this.apiUrl}/previous-chats/${username}`);
  }
}

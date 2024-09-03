import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../../app/services/chat.service';
import { SocketService } from '../services/socket.service';
import { Message } from '../models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  username: string | null = "";
  activeUsers: string[] = [];
  chatrooms: string[] = [];
  messages: Message[] = [];
  createRoomCode: string = '';
  currentMessage: string = '';
  currentIdentifier: string | null = null;
  currentChat: string = '';
  canSendMessage = true;
  messageCooldown = 1000;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private socketService: SocketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.getChatrooms();

    this.chatService.getActiveUsers().subscribe(users => {
        this.activeUsers = users.filter(user => user !== this.username);
    });

    this.loadPreviousChats();

    const socket = this.socketService.getSocket();
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket.connected); 
      socket.emit('setUsername', this.username);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.chatService.getMessages().subscribe(newMessage => {
      const exists = this.messages.some(
        message => message.from === newMessage.from && message.content === newMessage.content && message.timestamp === newMessage.timestamp
      );
      
      if (!exists) {
        this.messages.push(newMessage);
        this.cd.detectChanges();
        this.scrollToBottom('smooth');
      }
    });

    socket.emit('join', this.username);
  
    socket.on('updateActiveUsers', (users: string[]) => {
      this.activeUsers = users.filter(user => user !== this.username);
    });
  }

  private scrollToBottom(speed: string): void {
    setTimeout(() => {
      if (this.chatContainer && this.chatContainer.nativeElement) {
        const element = this.chatContainer.nativeElement;
        if(speed === 'fast')
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        else{
          element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    }, 0);
  }

  getChatrooms(): void {
    if (this.username) {
      this.chatService.getChatrooms(this.username).subscribe(chatrooms => {
        this.chatrooms = chatrooms;
        this.cd.detectChanges();
        this.scrollToBottom('fast');
      });
    }
  }

  openChat(identifier: string, type: string): void {
    let chatIdentifier = '';
    
    if (type === 'user') {
        chatIdentifier = `user_${[this.username, identifier].sort().join('_')}`;
    } else if (type === 'room') {
        chatIdentifier = `room_${identifier}`;
    }

    this.currentIdentifier = chatIdentifier;
    this.currentChat = identifier;

    this.chatService.joinRoom(this.currentIdentifier, this.username as string);
    
    this.loadChatHistory(chatIdentifier, type);
  }

  closeChat(): void {
    this.currentIdentifier = null;
    this.messages = [];
  }

  createRoom(): void {
    if (this.createRoomCode) {
      this.chatService.createRoom(this.createRoomCode);
      this.chatrooms.push(this.createRoomCode);
      this.openChat(this.createRoomCode, 'room');
      this.createRoomCode = '';
    }
  }

  sendMessage(): void {
    if (this.canSendMessage && this.currentMessage && this.currentIdentifier) {
      const message = new Message(this.username as string, this.currentMessage);
      const chatType = this.currentIdentifier.startsWith('user_') ? 'user' : 'room';
      this.chatService.sendMessage(message, this.currentIdentifier, chatType);
      this.currentMessage = '';
      
      this.canSendMessage = false;

      setTimeout(() => {
        this.canSendMessage = true;
      }, this.messageCooldown);
    }
  }

  loadChatHistory(chatIdentifier: string, chatType: string): void {
    this.chatService.getChatHistory(chatIdentifier, chatType).subscribe(messages => {
      this.messages = messages;
      this.cd.detectChanges();
      this.scrollToBottom('fast');
    });
  }  

  loadPreviousChats(): void {
    if (this.username) {
      this.chatService.getPreviousChats(this.username).subscribe(data => {
        let roomChats: string[] = data.roomChats.filter(chat => chat.startsWith('room_'))

        const roomChatIdentifiers = roomChats.map(identifier => this.getChatNameFromIdentifier(identifier));
        
        this.chatrooms = roomChatIdentifiers;
      });
    }
  }

  getChatNameFromIdentifier(identifier: string): string {
    if (identifier.startsWith('room_')) {
      return identifier.replace('room_', '');
    }
  
    if (identifier.startsWith('user_')) {
      const participants = identifier.replace('user_', '').split('_');
      return participants.find(participant => participant !== this.username) || '';
    }
  
    return '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}.${month}.${year}. ${hours}:${minutes}`;
  }

  logout(): void {
    this.authService.logout();
  }
}

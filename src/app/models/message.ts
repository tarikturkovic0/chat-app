export class Message {
    from: string;
    content: string;
    timestamp: string;
  
    constructor(from: string, content: string, timestamp?: string) {
      this.from = from;
      this.content = content;
      this.timestamp = timestamp ? timestamp : new Date().toISOString();
    }
  
    formatTimestamp(): string {
      const date = new Date(this.timestamp);
      return date.toLocaleString();
    }
  }
  
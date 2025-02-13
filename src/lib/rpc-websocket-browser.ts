import { EventEmitter } from 'events';

export class WebSocket extends EventEmitter {
  private socket: globalThis.WebSocket | null = null;
  private url: string;
  private options: any;

  constructor(address: string, options: any = {}) {
    super();
    this.url = address;
    this.options = options;
    this.connect();
  }

  private connect() {
    this.socket = new globalThis.WebSocket(this.url);

    this.socket.onopen = () => {
      this.emit('open');
    };

    this.socket.onclose = () => {
      this.emit('close');
    };

    this.socket.onerror = (error) => {
      this.emit('error', error);
    };

    this.socket.onmessage = (event) => {
      this.emit('message', event.data);
    };
  }

  public send(data: any) {
    if (this.socket && this.socket.readyState === globalThis.WebSocket.OPEN) {
      this.socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export class Client extends EventEmitter {
  private ws: WebSocket;
  private requestId = 0;
  private requests = new Map();

  constructor(address: string, options: any = {}) {
    super();
    this.ws = new WebSocket(address, options);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.ws.on('open', () => this.emit('open'));
    this.ws.on('close', () => this.emit('close'));
    this.ws.on('error', (error) => this.emit('error', error));
    this.ws.on('message', (data) => {
      try {
        const response = JSON.parse(data);
        if (response.id && this.requests.has(response.id)) {
          const { resolve, reject } = this.requests.get(response.id);
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.result);
          }
          this.requests.delete(response.id);
        }
        this.emit('message', response);
      } catch (error) {
        this.emit('error', error);
      }
    });
  }

  public call(method: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.requests.set(id, { resolve, reject });
      this.ws.send({
        jsonrpc: '2.0',
        method,
        params,
        id
      });
    });
  }

  public notify(method: string, params: any[] = []): void {
    this.ws.send({
      jsonrpc: '2.0',
      method,
      params
    });
  }

  public close() {
    this.ws.close();
  }
}

export { Client as CommonClient };
export default { WebSocket, Client, CommonClient: Client };

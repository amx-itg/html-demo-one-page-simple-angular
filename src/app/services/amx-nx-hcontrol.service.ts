import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';
import { Subscription } from 'rxjs';
import { EventBusService } from './event-bus.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AmxNxHcontrolService {
  private $hc: any = {};

  connection: any;
  errorMessage = "";
  tFile = '';
  pfTO: any = '';
  reconnectionTries: any
  private messageSubscription!: Subscription;

  constructor(private http: HttpClient, private logService: LogService, private eventBus: EventBusService) {
    this.$hc.version = 'v1.0.1';
    this.$hc.controller = {
      mode: false,
      host: '',
      path: '',
      port: '',
      url: '',
      key: '',
      username: '',
      password: '',
      connectSecurity: '',
      token: '',
      closeAllow: false
    };
    this.$hc.keepAlive = {
      to: '',
      interval: 120000,
      params: ['version'],
    };
    this.reconnectionTries = 0;
  }

  setInternal() {
    this.http.get('config?websocket').subscribe(
      (response: any) => {
        this.$hc.controller.host = response.websocket.host;
        this.$hc.controller.path = response.websocket.path;
        this.$hc.controller.port = response.websocket.port;

        if (this.$hc.controller.host !== location.hostname) {
          this.$hc.controller.host = location.hostname;
        }
        this.$hc.controller.mode = 'internal';
      },
      (error) => {
        console.error('Error getting internal connection:', error);
      }
    );
  }

  getExternalCredentials(url: string, autoConnect: boolean) {
    this.http.get(url).subscribe(
      (response: any) => {
        this.$hc.controller.url = response.url;
        this.$hc.controller.key = response.key;
        this.$hc.controller.username = response.username;
        this.$hc.controller.password = response.password;

        if (autoConnect) {
          this.setExternal(
            this.$hc.controller.url,
            this.$hc.controller.key,
            this.$hc.controller.username,
            this.$hc.controller.password
          );
          this.init();
        }
      },
      (error) => {
        console.error("Error, Configuration File doesn't exist", url);
      }
    );
  }

  setExternal(url: string, key: string, uname: string, pword: string) {
    const RSAEncrypt = new JSEncrypt();
    RSAEncrypt.setPublicKey(key);
    let token: any = {};
    token.username = uname;
    token.password = RSAEncrypt.encrypt(pword);
    this.$hc.controller.token = btoa(JSON.stringify(token));
    this.$hc.controller.mode = 'external';
  }

  init() {
    this.$hc.controller.connectSecurity = location.protocol.search(/https/) !== -1 ? 'wss://' : 'ws://';

    switch (this.$hc.controller.mode) {
      default: {
        this.eventBus.dispatch('hcontrol.connection', { "type": "error", "message": "Type Not Set by controller.set functions!" });
        break;
      }
      case 'external':
        this.connection = new WebSocket(this.$hc.controller.connectSecurity + this.$hc.controller.url + '?token=' + this.$hc.controller.token)

        break;
      case 'internal':
        this.connection = new WebSocket(
          this.$hc.controller.connectSecurity + this.$hc.controller.host + ':' + this.$hc.controller.port + this.$hc.controller.path
        );
        break;
    }
    this.bindEvents();

  }

  bindEvents() {
    this.connection.onmessage = (message: any) => {
      this.eventBus.dispatch('hcontrol.log', { "direction": "in", msgType: message.data.split(/(?<=^\S+)\s/)[0], data: JSON.parse(message.data.split(/(?<=^\S+)\s/)[1]) });
      this.parseResponse(message);
    }
    this.connection.onopen = () => {
      this.eventBus.dispatch('hcontrol.connection', { "type": "connection", "message": "connected" });
      this.keepAliveSend();
    }
    this.connection.onclose = () => {
      this.eventBus.dispatch('hcontrol.connection', { "type": "connection", "message": "disconnected" });
      if (!this.$hc.controller.closeAllow) {
        this.reconnect();
      }
    }
    this.connection.onerror = (error: any) => {
      this.eventBus.dispatch('hcontrol.connection', { "type": "connection", "message": "error" });
    }
  }

  reconnectAfterMs(tries: any) {
    return [1000, 2000, 5000, 10000][tries - 1] || 10000
  }

  reconnect() {
    const reconnectDelay = this.reconnectAfterMs(this.reconnectionTries + 1);

    setTimeout(() => {
      this.reconnectionTries++;
      this.init();
    }, reconnectDelay);
  }


  close() {
    this.eventBus.dispatch('hcontrol.connection', { "type": "connection", "message": "closed" });
    this.$hc.controller.closeAllow = true;
    this.connection.close();
  }


  keepAliveSend() {
    clearTimeout(this.$hc.keepAlive.to);
    this.$hc.keepAlive.to = setInterval(() => {
      let disco = { "params": this.$hc.keepAlive.params };
      this.send('disco ' + JSON.stringify(disco));
    }, this.$hc.keepAlive.interval)
  }

  send(str: any) {
    if (this.connection.readyState === 1) {
      this.eventBus.dispatch('hcontrol.log', { "direction": "out", msgType: str.split(/(?<=^\S+)\s/)[0], "data": JSON.parse(str.split(/(?<=^\S+)\s/)[1]) });
      this.connection.send(str);
    }
    this.keepAliveSend();
  }

  getAuth() {
    const disco = { params: ['auth'] };
  }

  /************** HCONTROL ************/

  get = {};
  set = {};
  types = ['button', 'level', 'passthru', 'command', 'page'];

  getButton(port: number = 0, channel: number = 0, property: string = 'channel') {
    let cmd = 'get ';
    let details = {
      path: `/button/${port}/${channel}/${property}`
    };
    this.send(cmd + JSON.stringify(details))
  }

  getLevel(port: number = 0, level: number = 0, property: string = 'level') {
    let cmd = 'get ';
    let details = {
      path: `/level/${port}/${level}/${property}`
    };
    this.send(cmd + JSON.stringify(details));
  }

  getPage() {
    let cmd = 'get ';
    let details = {
      path: '/page/emulator'
      
    };
    this.send(cmd + JSON.stringify(details));
  }

  getPassThru(items: any) {

  }

  getFile(filePath: string) {
    let cmd = 'getfile ';
    let details = {
      path: filePath,
      state: 'begin'
    };
    this.send(cmd + JSON.stringify(details));
  }

  setButton(port: number = 1, channel: number = 1, value: any) {
    value = this.conformChannelValue(value);
    let cmd = 'set ';
    let details = {
      path: `/button/${port}/${channel}/button`,
      value: value
    };

    this.send(cmd + JSON.stringify(details));
  }

  private conformChannelValue(value: any): string {
    let pushEvent = [1, '1', true, 'on', 'push', 'pushed', 'press', 'pressed', 'go'];
    let releaseEvent = [0, '0', false, 'off', 'release', 'released', 'stop', 'not pressed'];
    if (pushEvent.includes(value.toString().toLowerCase())) {
      return 'press';
    } else if (releaseEvent.includes(value.toString().toLowerCase())) {
      return 'release';
    } else {
      return 'press';
    }
  }

  setLevel(port: number = 1, level: number = 1, value: number = 125) {
    value = Math.min(Math.max(value, 0), 255);
    let cmd = 'set ';
    let details = {
      path: `/level/${port}/${level}/level`,
      value: value
    };
    this.send(cmd + JSON.stringify(details));
  }


  setPassThru(items: any) {

  }

  parseFileResponse(messageData: any) {
    try {
      const parts = messageData.data.split(' ');
      const type = parts[0].replace('@', '').trim();
      const objStr = parts[1];
      const obj = JSON.parse(objStr);

      if (type === 'getfile' && obj.state === 'begin') {
        this.tFile = ''
      } else if (type === 'block') {
        this.tFile += obj.data;
      }

      clearTimeout(this.pfTO);
      this.pfTO = setTimeout(() => {
        this.tFile = atob(this.tFile);
        this.eventBus.dispatch('hcontrol.file', this.tFile);
      }, 150);
    } catch (error) {
      console.log('PARSE FILE RESPONSE ERROR: - hcontrol return', messageData, error);
    }
  }

  parseResponse(message: any) {
    try {
      let type = message.data.split(/(?<=^\S+)\s/)[0].replace('@', '').trim();
      let obj = message.data.split(/(?<=^\S+)\s/)[1];

      if (type === 'disco') {
        let obj = message.data.split('@disco')[1];
        obj = JSON.parse(obj);
        if (obj.auth !== undefined) {
          let authObj = {
            warn: obj.auth.warn,
            reason: obj.auth.reason,
            mode: obj.auth.mode
          }
          setTimeout(() => {
            this.eventBus.dispatch('hcontrol.auth', authObj);
          }, 750);
        }
      } else {
        obj = JSON.parse(obj);
        if (type === 'block' || type === 'getfile') {
          this.parseFileResponse(message);
        } else {
          if (Array.isArray(obj)) {
            for (var rx of obj) {
              this.conformBroadcast(type, rx.path, rx.value);
            }
          } else {
            if (obj.version !== undefined) {
              //Handle DISCO response?
            }
            else {
              this.conformBroadcast(type, obj.path, obj.value);
            }
          }
        }
      }
    } catch (error) {
      this.errorMessage = message.data;
    }
  }

  conformBroadcast(type: any, path: any, value: any) {

    if (type == 'publish' || type == 'get') {

      path = path.split('/');
      let bcType = path[1];
      let bcPort = path[2];
      let bcElem = path[3];
      let bcProperty = path[4];
      let bcVal = value;

      switch (bcType) {
        case 'page': {
          this.page(bcPort);
          break;
        }
        case 'level': {
          this.level(bcPort, bcElem, bcVal);
          break;
        }
        case 'auth': {
          this.auth(bcPort);
          break;
        }
        case 'log': {
          this.eventBus.dispatch('logUpdates');
          break;
        }
        case 'button': {
          (this as any)[bcProperty](bcPort, bcElem, bcVal);
          break;
        }
      }
    }
  }

  auth(opts: any) {
    this.eventBus.dispatch('hcontrol.auth', opts);
  };
  page(opts: any) {
    this.eventBus.dispatch('page.event', opts);
  };
  level(port: any, level: any, value: any) {
    this.eventBus.dispatch('level.event', { port, level, value });
  };
  channel(port: any, channel: any, state: any) {
    this.eventBus.dispatch('channel.event', { "event": "state", port, channel, state });
  };
  text(port: any, channel: any, newText: any) {
    this.eventBus.dispatch('channel.event', { "event": "text", port, channel, newText });
  };
  enable(port: any, channel: any, state: any) {
    this.eventBus.dispatch('channel.event', { "event": "enable", port, channel, state });
  };
  show(port: any, channel: any, state: any) {
    this.eventBus.dispatch('channel.event', { "event": "show", port, channel, state });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}

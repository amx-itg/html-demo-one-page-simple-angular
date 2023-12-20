import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogMessageService {
  logConfig = {
    inIcon: 'bi bi-arrow-right',
    outIcon: 'bi bi-arrow-left',
    connectIcon: 'bi bi-activity',
    maxItems: 50,
  };

  getTime(): string {
    return new Date().toLocaleTimeString().split(' ')[0];
  }

  connectionLogMessage(data: any, log: any): any {
    let i: any = {};
    if (data && data.message !== null) {
      switch (data.message) {
        case 'connected': {
          i = {
            icon: log.connectIcon + ' text-success',
            time: this.getTime(),
            path: 'connection',
            value: true
          };
          break;
        }
        case 'disconnected': {
          i = {
            icon: log.connectIcon,
            time: this.getTime(),
            path: 'connection',
            value: false
          };
          break;
        }
        case 'error': {
          i = {
            icon: log.connectIcon + ' text-warning',
            time: this.getTime(),
            path: 'connection',
            value: 'error'
          };
          break;
        }
        case 'closed': {
          i = {
            icon: log.connectIcon + ' text-warning',
            time: this.getTime(),
            path: 'connection',
            value: 'closed'
          };
          break;
        }
      }
    }
    return i;
  }

  logMessage(data: any, log: any): any {
    let i = {};
    switch (data.direction) {
      case 'in': {
        if (data.msgType !== '@disco') {
          i = {
            icon: log.inIcon,
            msgType: data.msgType,
            time: this.getTime(),
            path: data.data.path,
            value: data.data.value
          };
        }
        break;
      }
      case 'out': {
        i = {
          icon: log.outIcon,
          msgType: data.msgType,
          time: this.getTime(),
          path: data.data.path,
          value: data.data.value
        };
        break;
      }
    }

    return i;
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogMessageService } from 'src/app/utils/log-message.service';
@Injectable({
    providedIn: 'root'
})
export class LogService {
    constructor(private log: LogMessageService) { }
    private logSubject = new BehaviorSubject<any[]>([]);
    logs$ = this.logSubject.asObservable();

    setMessage(message: any) {
        const logs = this.logSubject.value || [];
        if (logs.length > this.log.logConfig.maxItems) {
            logs.pop();
        }
        logs.unshift(message);

        this.logSubject.next(logs);
    }

    cleanMessage() {
        this.logSubject.next([])
    }

}

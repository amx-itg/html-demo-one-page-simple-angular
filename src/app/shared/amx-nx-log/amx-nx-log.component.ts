import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { EventBusService } from 'src/app/services/event-bus.service';
import { LogService } from 'src/app/services/log.service';
import { LogMessageService } from 'src/app/utils/log-message.service';

@Component({
  selector: 'amx-nx-log',
  templateUrl: './amx-nx-log.component.html',
  styleUrls: ['./amx-nx-log.component.scss']
})
export class AmxNxLogComponent {
  @Input() messages: any;
  logMessages: any = [];
  private bindLogSub: Subscription = new Subscription;
  private bindConnectionSub: Subscription = new Subscription;
  private messagesListSubscription: Subscription = new Subscription;
  messagesList: any = [];

  constructor(private eventBusService: EventBusService,
    private log: LogMessageService, private cdr: ChangeDetectorRef, private logService: LogService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.logMessages = this.messages;
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.getMessage();
    this.bindConnectionEvents();
    this.bindLogEvents();
  }

  addItem(data: any): void {
    let msgs;
    if (this.logMessages.length) {
      msgs = [...this.logMessages];
    } else {
      msgs = []
    }
    if (msgs.length > this.log.logConfig.maxItems) {
      this.logMessages.pop();
    }
    if (data.path) {
      this.logMessages.unshift(JSON.parse(JSON.stringify(data)))
      this.logService.setMessage(JSON.parse(JSON.stringify(data)))
    }
    this.cdr.detectChanges();
  }
  
  getMessage() {
    this.messagesListSubscription = this.logService.logs$.pipe(
      take(1) 
    ).subscribe((data: any) => {
      this.logMessages = data;
      this.cdr.detectChanges();
    });
  }

  bindConnectionEvents() {
    this.bindConnectionSub = this.eventBusService.on('hcontrol.connection').subscribe((data: any) => {
      if (data.type === 'connection') {
        const i = this.log.connectionLogMessage(data, this.log.logConfig);
        this.addItem(i);
      }

    });
  }

  bindLogEvents(): void {
    this.bindLogSub = this.eventBusService.on('hcontrol.log').subscribe((data: any) => {
      const i = this.log.logMessage(data, this.log.logConfig);
      this.addItem(i);
    });
  }

  ngOnDestroy(): void {
    this.bindLogSub.unsubscribe();
    this.bindConnectionSub.unsubscribe();
    this.messagesListSubscription.unsubscribe();
  }
}

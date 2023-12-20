import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { EventBusService } from 'src/app/services/event-bus.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'amx-nx-connection-log-drawer',
  templateUrl: './amx-nx-connection-log-drawer.component.html',
  styleUrls: ['./amx-nx-connection-log-drawer.component.scss']
})
export class AmxNxConnectionLogDrawerComponent {
  closeResult: string = "";
  messages: any[] = [];
  @Input() show :any;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef, private eventBusService: EventBusService, private logService: LogService) {
  }

  clearLog(): void {
    this.messages = [];
    this.cdr.detectChanges();
  }

}

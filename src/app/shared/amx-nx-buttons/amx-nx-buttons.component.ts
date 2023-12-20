import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AmxNxHcontrolService } from 'src/app/services/amx-nx-hcontrol.service';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'amx-nx-buttons',
  templateUrl: './amx-nx-buttons.component.html',
  styleUrls: ['./amx-nx-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmxNxButtonsComponent {
  @Input() configuration: any = {};
  @Input() port: any = "";
  btnConfig: any;
  isInitialized = false;
  btn: any = null;


  private channelEventSubscription: Subscription = new Subscription;

  constructor(private amxNxHcontrolService: AmxNxHcontrolService, private eventBusService: EventBusService, private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuration']) {

      let btn = this.configuration ? this.configuration : {};
      btn.port = this.configuration.port !== undefined ? this.configuration.port : this.port;
      btn.initText = this.configuration.text !== undefined ? this.configuration.text : 'Button';
      
      if (
        this.btn &&
        (this.btn.port !== this.configuration.port ||
          this.btn.channel !== this.configuration.channel)
      ) {
        this.getButton(btn);
      }
      this.btn = Object.assign({}, btn);
      if (!this.isInitialized) {        
        this.getButton(this.btn);
        this.bindEvent();
        this.isInitialized = true;
      }
    }
  }

  getButton(config: any): void {
    this.amxNxHcontrolService.getButton(config.port, config.channel, 'show');
    this.amxNxHcontrolService.getButton(config.port, config.channel, 'enable');
    this.amxNxHcontrolService.getButton(config.port, config.channel, 'text');
    this.amxNxHcontrolService.getButton(config.port, config.channel);
  }

  setButton(event: any) {
    this.amxNxHcontrolService.setButton(this.btn.port, this.btn.channel, event);
  }

  bindEvent(): void {
    this.channelEventSubscription = this.eventBusService.on('channel.event').subscribe((data) => {
      if (data && data.port) {      
        const btn = this.btn;      
        if (parseInt(data.port) === parseInt(btn.port) && parseInt(btn.channel) === parseInt(data.channel)) {
          switch (data.event) {
            case 'state': {
              if (data.state) {
                btn.active = true;
              } else {
                btn.active = false;
              }
              break;
            }
            case 'text': {
              if (data.newText !== undefined && data.newText !== '') {
                btn.oldText = btn.text;
                btn.text = data.newText;
              } else if (btn.initText !== btn.text || data.newText === '') {
                btn.text = btn.initText;
              }
              break;
            }
            case 'enable': {
              if (data.state) {
                btn.disabled = false;
              } else {
                btn.disabled = true;
              }
              break;
            }
            case 'show': {
              if (data.state) {
                btn.hidden = false;
              } else {
                btn.hidden = true;
              }
              break;
            }
          }
          this.btn = btn;
          this.cdr.detectChanges();
        }
      }
    })
  }

  ngOnDestroy(): void {
    if (this.channelEventSubscription) {
      this.eventBusService.remove("channel.event")
      this.channelEventSubscription.unsubscribe();
    }
  }
}

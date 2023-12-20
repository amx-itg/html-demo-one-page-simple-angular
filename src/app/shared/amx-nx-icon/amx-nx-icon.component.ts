import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AmxNxHcontrolService } from 'src/app/services/amx-nx-hcontrol.service';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'amx-nx-icon',
  templateUrl: './amx-nx-icon.component.html',
  styleUrls: ['./amx-nx-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmxNxIconComponent {
  @Input() configuration: any;
  private channelEventSubscription: Subscription = new Subscription;
  iconConfig: any;
  isInitialized = false;

  private subscription: Subscription = new Subscription();

  constructor(private amxNxHcontrolService: AmxNxHcontrolService, private cdr: ChangeDetectorRef, private eventBusService: EventBusService) { }

  ngOnInit(): void {
    this.processConfiguration();
  }

  processConfiguration(): void {
    const icon = this.configuration ? this.configuration : {};
    if (icon.port === undefined) {
      icon.port = 1;
    }
    if (icon.channel === undefined) {
      icon.channel = 1;
    }
    icon.labelVisible === undefined || icon.labelVisible
      ? (icon.labelVisible = true)
      : (icon.labelVisible = false);
    if (icon.text === undefined) {
      icon.text = 'Label';
    }
    icon.initText = icon.text;

    this.iconConfig = icon;

    if (this.iconConfig && !this.isInitialized) {
      this.bindEvent();
      this.isInitialized = true;
    }
  }

  private bindEvent(): void {
    this.channelEventSubscription = this.eventBusService.on('channel.event').subscribe((data: any) => {
      const icon = Object.assign({}, this.iconConfig);
      if (parseInt(data.port) === parseInt(icon.port)) {
        if (parseInt(icon.channel) === parseInt(data.channel)) {
          switch (data.event) {
            case 'text': {
              if (data.newText !== undefined && data.newText !== '') {
                icon.text = data.newText;
              } else if (icon.initText !== icon.text || data.newText === '') {
                icon.text = icon.initText;
              }
              break;
            }

            case 'icon': {
              icon.icon = data.icon;
              break;
            }
          }
        }
      }
    });
  }

  onChange(e: any) {

    this.iconConfig = {
      ...this.iconConfig,
      currentValue: e.target.value
    }
    this.amxNxHcontrolService.setLevel(this.iconConfig.port, this.iconConfig.level, e.target.value);

  }

  ngOnDestroy(): void {
    this.channelEventSubscription.unsubscribe();
    this.eventBusService.remove("channel.event")

  }
}

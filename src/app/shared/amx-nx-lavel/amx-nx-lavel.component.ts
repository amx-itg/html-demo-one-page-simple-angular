import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AmxNxHcontrolService } from 'src/app/services/amx-nx-hcontrol.service';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'amx-nx-lavel',
  templateUrl: './amx-nx-lavel.component.html',
  styleUrls: ['./amx-nx-lavel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmxNxLavelComponent {
  @Input() configuration: any;
  lvlConfig: any;
  isInitialized: boolean = false;
  private levelEventSubscription: Subscription = new Subscription;

  constructor(private amxNxHcontrolService: AmxNxHcontrolService, private cdr: ChangeDetectorRef, private eventBusService: EventBusService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuration']) {
      let lvl = this.configuration ? this.configuration : {};
      if (lvl.port == undefined) { lvl.port = 1 }
      if (lvl.level == undefined) { lvl.level = 1 }
      if (lvl.min == undefined) { lvl.min = 0 }
      if (lvl.max == undefined) { lvl.max = 255 }
      if (lvl.changeOn == undefined) { lvl.changeOn = 'input' }
      if (lvl.currentValue === undefined) { lvl.currentValue = 0 }
      
      if (
        this.lvlConfig &&
        (this.lvlConfig.port !== this.configuration.port ||
          this.lvlConfig.level !== this.configuration.level)
          ) {
        this.amxNxHcontrolService.getLevel(lvl.port, lvl.level);
      }
      this.lvlConfig = Object.assign({}, lvl);
      if (!this.isInitialized) {        
        this.amxNxHcontrolService.getLevel(this.lvlConfig.port, this.lvlConfig.level);
        this.bindEvent();
        this.isInitialized = true;
      }
    }
  }

  bindEvent(): void {

    this.levelEventSubscription = this.eventBusService.on('level.event').subscribe((data: any) => {

      const lvl = Object.assign({}, this.lvlConfig);
      if (data.port == lvl.port && data.level == lvl.level) {
        lvl.currentValue = data.value;
        this.lvlConfig = Object.assign({}, lvl);
        this.cdr.detectChanges();
      }
    })
  }

  onChange(e: any) {

    this.lvlConfig = {
      ...this.lvlConfig,
      currentValue: e.target.value
    }
    this.amxNxHcontrolService.setLevel(this.lvlConfig.port, this.lvlConfig.level, e.target.value);

  }

  ngOnDestroy(): void {
    this.levelEventSubscription.unsubscribe();
    this.eventBusService.remove("level.event")

  }
}

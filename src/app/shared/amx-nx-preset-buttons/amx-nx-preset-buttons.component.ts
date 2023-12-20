import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'amx-nx-preset-buttons',
  templateUrl: './amx-nx-preset-buttons.component.html',
  styleUrls: ['./amx-nx-preset-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmxNxPresetButtonsComponent {
  @Input() configuration: any = {};
  slideConfig: any;  
  activeSlideIndex: number = 0; 
  sliderValue: number = 50; 

  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.sliderValue = parseInt(target.value);
  }

  ngOnInit(): void {
    let grid: any = this.configuration ? this.configuration : {};
    if (grid.port === undefined) { grid.port = 1; }
    if (grid.btns === undefined) { grid.btns = []; }
    grid.justify = (grid.gridJustify !== undefined) ? grid.gridJustify : 'center';
    grid.slides = [];
    while (grid.btns.length) {
      grid.slides.push(grid.btns.splice(0, grid.size));
    }
    
    this.slideConfig = grid;
  }
}

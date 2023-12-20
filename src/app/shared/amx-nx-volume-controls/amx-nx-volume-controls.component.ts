import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'amx-nx-volume-controls',
  templateUrl: './amx-nx-volume-controls.component.html',
  styleUrls: ['./amx-nx-volume-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmxNxVolumeControlsComponent {
  @Input() configuration: any = {};
  slideConfig: any;

  ngOnInit(): void {
    this.setSlideConfiguration();
  }

  setSlideConfiguration(): void {
    let grid = this.configuration ? this.configuration : {};
    if (grid.port === undefined) { grid.port = 1; }
    if (grid.volumes === undefined) { grid.volumes = []; }
    if (grid.size === undefined) { grid.size = 3; }
    grid.justify = grid.gridJustify !== undefined ? grid.gridJustify : 'center';
    grid.slides = [];
    while (grid.volumes.length) {
      grid.slides.push(grid.volumes.splice(0, grid.size));
    }
    this.slideConfig = grid;
  }
}

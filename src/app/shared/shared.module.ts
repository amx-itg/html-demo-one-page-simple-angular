import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SimplemdeModule } from 'ngx-simplemde';
import { NgbActiveOffcanvas, NgbCarouselModule, NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { PreloadingComponent } from './preloading/preloading.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AmxNxButtonsComponent } from './amx-nx-buttons/amx-nx-buttons.component';
import { AmxNxConnectionLogDrawerComponent } from './amx-nx-connection-log-drawer/amx-nx-connection-log-drawer.component';
import { AmxNxLogComponent } from './amx-nx-log/amx-nx-log.component';
import { AmxNxScrollBarComponent } from './amx-nx-scroll-bar/amx-nx-scroll-bar.component';
import { AmxNxLavelComponent } from './amx-nx-lavel/amx-nx-lavel.component';
import { AmxNxIconComponent } from './amx-nx-icon/amx-nx-icon.component';
import { AmxNxPresetButtonsComponent } from './amx-nx-preset-buttons/amx-nx-preset-buttons.component';
import { AmxNxVolumeControlsComponent } from './amx-nx-volume-controls/amx-nx-volume-controls.component';
import { AmxNxMuteButtonsComponent } from './amx-nx-mute-buttons/amx-nx-mute-buttons.component';
@NgModule({
  declarations: [
    PreloadingComponent,
    AmxNxButtonsComponent,
    AmxNxConnectionLogDrawerComponent,
    AmxNxLogComponent,
    AmxNxScrollBarComponent,
    AmxNxLavelComponent,
    AmxNxIconComponent,
    AmxNxPresetButtonsComponent,
    AmxNxVolumeControlsComponent,
    AmxNxMuteButtonsComponent,
  ],
  exports: [
    PreloadingComponent,
    AmxNxButtonsComponent,
    AmxNxConnectionLogDrawerComponent,
    AmxNxLogComponent,
    AmxNxScrollBarComponent,
    AmxNxLavelComponent,
    AmxNxIconComponent,
    AmxNxPresetButtonsComponent,
    AmxNxVolumeControlsComponent,
    AmxNxMuteButtonsComponent,
  ],
  providers: [NgbActiveOffcanvas],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbCarouselModule,
    HttpClientModule,
    SimplebarAngularModule,
    SimplemdeModule.forRoot({
      // Global options
      options: {
        autosave: { enabled: true, uniqueId: 'MyUniqueID' },
      },
    }),
    NgbProgressbarModule
  ]
})
export class SharedModule { }

import { Component } from '@angular/core';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'amx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  btnGridConfig = {
    port: 1,
    size: 8,
    btns: [
      { channel: 502, text: 'Room<br>On', textStyle: 'text-light', style: 'btn-secondary bg-gradient ', icon: 'bi bi-power' },
      { channel: 503, text: 'Room<br>Off', textStyle: 'text-light', style: 'btn-secondary bg-gradient ', icon:"bi bi-power"},
      { channel: 504, text: 'Mic On', style: 'btn-secondary bg-gradient ', icon:"bi bi-mic-fill"},
      { channel: 505, text: 'Mic Off', style: 'btn-secondary bg-gradient ', icon:"bi bi-mic-mute-fill"},
      { channel: 506, text: 'TV On', style: 'btn-secondary bg-gradient', icon:"bi bi-tv-fill"},
      { channel: 507, text: 'TV Off', style: 'btn-secondary bg-gradient', icon:"bi bi-tv"}
    ],
  };

  volumeControlConfig = {
    port: 1,
    size: 3,
    volumes: [
      {
        range: { level: 1, setValue: 255 },
        icon: { channel: 1, labelVisible: true, text: 'Microphone', icon: 'bi-mic' },
        btn: { channel: 512, text: 'Mute', textStyle: 'text-light', style: 'btn-danger rounded' }
      },
      {
        range: { level: 2, setValue: 255 },
        icon: { channel: 2, labelVisible: true, text: 'Speakers', icon: 'bi-volume-up' },
        btn: { channel: 513, text: 'Mute', textStyle: 'text-light', style: 'btn-success rounded' }
      }
      // {
      //   range: { level: 1, setValue: 255 },
      //   icon: { channel: 1, labelVisible: true, text: 'Microphone', icon: 'bi-mic' },
      //   btn: { channel: 514, text: 'Mute', textStyle: 'text-light', style: 'bg-danger rounded' }
      // },
      // {
      //   range: { level: 1, setValue: 255 },
      //   icon: { channel: 1, labelVisible: true, text: 'Label', icon: 'bi-volume-up' },
      //   btn: { channel: 515, text: 'Mute', textStyle: 'text-light', style: 'bg-success rounded' }
      // }
    ]
  }
  constructor(eventBus: EventBusService) { }
}

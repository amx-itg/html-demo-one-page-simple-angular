import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap';
import { AmxNxHcontrolService } from './services/amx-nx-hcontrol.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBusService } from './services/event-bus.service';
import { Subscription } from 'rxjs';
import { ThemeService, ThemeState } from './services/theme.service';

@Component({
  selector: 'amx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'amx-sdk-angular';
  themeState!: ThemeState;
  preLoading: boolean = true;
  connectionStatusClass = 'bg-danger';
  isDarkTheme = false;
  isShowDrawer: boolean = false;
  toggleConfiguration = {
    port: 1,
    channel: 1,
    switch: true,
    text: 'Dark',
    labelVisible: true,
    checked: true,
    hidden: false
  };
  private hconnectEventSubscription: Subscription = new Subscription;

  constructor(public amxControlService: AmxNxHcontrolService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventBusService: EventBusService,
    config: NgbOffcanvasConfig, 
    private cdr: ChangeDetectorRef,
    public themeService: ThemeService) {
    config.position = 'end';
  }

  
  ngOnInit(): void {
    this.themeService.getThemeState().subscribe((state: ThemeState) => {
      this.themeState = state;      
    });
    this.amxControlService.getExternalCredentials('../assets/configuration/controller.json', true);

    this.eventBusService.on('page.event').subscribe((data) => {
      if (typeof data === 'string') {
        const page = data.toLowerCase();
        console.log('Got Page Event, Switching Page to:', page);
        this.router.navigate([`/${page}`]);
      }
    });
    setTimeout(() => {
      this.preLoading = false
    }, 1000);  
    this.bindEvent()
  }


  bindEvent(): void {
    this.hconnectEventSubscription = this.eventBusService.on('hcontrol.connection').subscribe((data: any) => {
      if (data.type === 'connection') {
        switch (data.message) {
          case 'connected': {
            this.connectionStatusClass = "bg-success";
            break;
          }
          case 'disconnected': {
            this.connectionStatusClass = "bg-danger";
            break;
          }
          case 'error': {
            this.connectionStatusClass = "bg-warning";
            break;
          }
        }
        this.cdr.detectChanges();
      }
    })
  }
 
  toggleDrawer(): void {
    this.isShowDrawer = !this.isShowDrawer;
  }

  setIsShowDrawer() {
    this.isShowDrawer = !this.isShowDrawer;
  }

  onChange(event: any): void {
    this.themeService.updateThemeState(event.target.checked);
    this.toggleConfiguration.text = event.target.checked ? 'Dark' : 'Light';
  }

}

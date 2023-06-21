import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
      this.primengConfig.zIndex = {
          modal: 1100,    // dialog, sidebar
          overlay: 1000,  // dropdown, overlaypanel
          menu: 1000,     // overlay menus
          tooltip: 1100   // tooltip
      };
  }
}

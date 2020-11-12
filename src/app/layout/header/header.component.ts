import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  scenarioUrl = '';
  configUrl = 'config';

  goToMainPage() {
    window.location.href = this.scenarioUrl;
  }
}

import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isFirstScreen = () => this.screenService.display.firstScreen;
  constructor(private navService: NavigationService, private screenService: ScreenService) {}

  ngOnInit(): void {}

  clickGoBack() {
    if (this.isFirstScreen()) {
      this.navService.redirectToHome();
    } else {
      this.navService.clickToBack.next();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  // TODO КОСТЫЛЬ как быстрое решение. Требоуется доработка от backend(-a)
  //  на добавление флага о том что страница первая
  isFirstScreen = () => !Object.keys(this.screenService.applicantAnswers).length;
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

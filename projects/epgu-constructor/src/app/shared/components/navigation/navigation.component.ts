import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  constructor(private navService: NavigationService, private screenService: ScreenService) {}

  ngOnInit(): void {}

  clickGoBack(): void {
    const { firstScreen } = this.screenService.display;
    if (firstScreen) {
      this.navService.redirectToHome();
    } else {
      this.navService.prev();
      // Если нужно будет передавать данные, то лучше
      // складировать состояние в какое-то харнилище, а при навигации
      // отправлять их или найди коммит который создал этот комменатрий
      // this.navService.clickToBack.next();
    }
  }
}

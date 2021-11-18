import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterService } from '@epgu/ui/services/footer';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  scenarioUrl = '';

  constructor(public footerService: FooterService) {}
}

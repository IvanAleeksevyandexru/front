import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
})
export class AddPassportComponent {
  data$: Observable<ComponentBase> = this.screenService.component$;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private screenService: ScreenService,
  ) {}

  onPassportDataChange(data: ComponentBase): void {
    this.currentAnswersService.state = data;
  }
}

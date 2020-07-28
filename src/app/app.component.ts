import { Component } from '@angular/core';
import {SimpleComponentInterface} from '../constructor/interfaces/simple-component.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'epgu-form-frontend';

  // WelcomeComponent <start>
  welcomeComponentData: SimpleComponentInterface = {
    header: 'Регистрация и снятие с регистрации по месту пребывания',
    label: '<p>Вы переехали на новое место, хотите зарегистрировать себя у родственников или хотиие прекратитть регистрацию - воспользуейтесь данной услугой...</p>',
    actions: [
      {
        label: 'Продолжить',
        method: 'nextPage'
      }
    ]
  }
  // WelcomeComponent <end>
}

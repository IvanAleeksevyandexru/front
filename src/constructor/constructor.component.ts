import { Component } from '@angular/core';
import {SimpleComponentInterface} from '../constructor/interfaces/simple-component.interface';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss']
})
export class ConstructorComponent {
  // WelcomeComponent <start>
  welcomeComponentData: SimpleComponentInterface = {
    header: 'Регистрация и снятие с регистрации по месту пребывания',
    label: '<p>Вы переехали на новое место, хотите зарегистрировать себя у родственников или хотиие прекратитть регистрацию - воспользуейтесь данной услугой...</p>',
    submitButtonLabel: 'Продолжить'
  }
  // WelcomeComponent <end>
}

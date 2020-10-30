import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-payment-type-selector',
  templateUrl: './payment-type-selector.component.html',
  styleUrls: ['./payment-type-selector.component.scss'],
})
export class PaymentTypeSelectorComponent implements OnInit {
  constructor(public screenService: ScreenService) {}

  ngOnInit(): void {
    console.log('test');
  }
}

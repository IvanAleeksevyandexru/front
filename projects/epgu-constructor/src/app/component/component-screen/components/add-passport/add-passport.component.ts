import { Component, Input, OnInit } from '@angular/core';
import { TextTransform } from '../../../../shared/types/textTransform';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-add-passport',
  templateUrl: './add-passport.component.html',
  styleUrls: ['./add-passport.component.scss'],
})
export class AddPassportComponent implements OnInit {
  @Input() data: ComponentBase;

  constructor(private currentAnswersService: CurrentAnswersService) {}

  ngOnInit(): void {}

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }

  onPassportDataChange(data: ComponentBase): void {
    this.currentAnswersService.state = data;
  }
}

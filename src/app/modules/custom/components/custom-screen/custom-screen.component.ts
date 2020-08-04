import { Component, Input, OnInit } from '@angular/core';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME } from '../../../../constant/global';

@Component({
  selector: 'app-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
})
export class CustomScreenComponent implements OnInit {
  screenComponentName = SCREEN_COMPONENT_NAME;
  @Input() data: EgpuResponseDisplayInterface;
  constructor() {}

  ngOnInit(): void {}
}

import { Component, /* OnInit, */ Input } from '@angular/core';
import { UNIQUE_COMPONENT_NAME } from '../../../../constant/global';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
})
export class UniqueScreenComponent /* implements OnInit  */ {
  uniqueComponentName = UNIQUE_COMPONENT_NAME;
  @Input() data: EgpuResponseDisplayInterface;

  // constructor() { }

  // ngOnInit(): void {
  // }
}

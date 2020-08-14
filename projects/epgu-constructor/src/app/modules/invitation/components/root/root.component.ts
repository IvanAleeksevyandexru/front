import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  typeComponent = SCREEN_COMPONENT_NAME;

  @Input() data: EgpuResponseDisplayInterface;
  @Input() isLoading: boolean;
  @Output() resolve: EventEmitter<string> = new EventEmitter<string>();

  sendEmail(email: string) {
    this.resolve.emit(email);
  }

  ngOnInit(): void {}
}

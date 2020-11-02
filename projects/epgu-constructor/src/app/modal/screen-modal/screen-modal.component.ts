import { Component, OnInit } from '@angular/core';
import { HelperService } from 'epgu-lib';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { ScreenModalService } from './screen-modal.service';

@Component({
  selector: 'epgu-constructor-screen-modal',
  templateUrl: './screen-modal.component.html',
  styleUrls: ['./screen-modal.component.scss'],
})
export class ScreenModalComponent extends ModalBaseComponent implements OnInit {
  showCrossButton = true;
  title = 'some title';
  isMobile: boolean;
  public scrollConfig = { suppressScrollX: true, wheelPropagation: false };

  constructor(private screenModalService: ScreenModalService) {
    super();
  }

  ngOnInit(): void {
    this.isMobile = HelperService.isMobile();
  }

  closeModal(): void {
    console.log('close screen modal');
  }
}

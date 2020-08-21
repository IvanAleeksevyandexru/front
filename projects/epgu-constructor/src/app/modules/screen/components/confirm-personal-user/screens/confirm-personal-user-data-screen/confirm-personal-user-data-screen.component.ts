import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ConfirmUserDataInterface } from '../../../../../../../interfaces/confirm-user-data.interface';
import { ConstructorConfigService } from '../../../../../../services/config/constructor-config.service';

@Component({
  selector: 'app-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss'],
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  @Input() data: ConfirmUserDataInterface;
  @Output() actionSelect = new EventEmitter();
  @Output() nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private constructorConfigService: ConstructorConfigService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'editUserData':
        this.document.location.href = this.constructorConfigService.config.externalLkUrl;
        break;
      default:
        this.actionSelect.emit(event);
        break;
    }
  }

  nextStep(): void {
    this.nextStepEvent.emit(true);
  }

  ngOnInit(): void {}
}

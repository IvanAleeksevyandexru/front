import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicComponent } from './logic.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { LogicService } from '../service/logic.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { BaseModule } from '../../../shared/base.module';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';

describe('LogicComponent', () => {
  let component: LogicComponent;
  let fixture: ComponentFixture<LogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogicComponent],
      imports: [BaseModule],
      providers: [
        LogicService,
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule, HealthService } from 'epgu-lib';

import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { PassportComponent } from './passport.component';
import { ConstructorMaskedInputModule } from '../epgu-lib/constructor-masked-input/constructor-masked-input.module';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { MaskHandleModule } from '../../pipes/mask-handle/mask-handle.module';

import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

describe('PassportComponent', () => {
  let component: PassportComponent;
  let fixture: ComponentFixture<PassportComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          EpguLibModule,
          FormsModule,
          RouterTestingModule,
          ConstructorMaskedInputModule,
          BaseComponentsModule,
          MaskHandleModule,
        ],
        declarations: [PassportComponent],
        providers: [
          UnsubscribeService,
          HealthService,
          { provide: ScreenService, useClass: ScreenServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportComponent);
    component = fixture.componentInstance;
    component.attrs = {
      fields: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

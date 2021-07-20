import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule, HealthService } from '@epgu/epgu-lib';
import { EventBusService, FocusManagerService, FocusManagerServiceStub, InputErrorModule } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { MaskHandleModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { ConstructorMaskedInputModule } from '../constructor-masked-input/constructor-masked-input.module';
import { PassportComponent } from './passport.component';

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
          HttpClientTestingModule,
          InputErrorModule
        ],
        declarations: [PassportComponent],
        providers: [
          UnsubscribeService,
          HealthService,
          { provide: ScreenService, useClass: ScreenServiceStub },
          EventBusService,
          { provide: FocusManagerService, useClass: FocusManagerServiceStub },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportComponent);
    component = fixture.componentInstance;
    component.attrs = {
      participant: null,
      fields: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

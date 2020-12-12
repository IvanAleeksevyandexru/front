import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenContainerComponent } from './screen-container.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { HealthService } from 'epgu-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationModule } from '../navigation/navigation.module';

describe('ScreenContainerComponent', () => {
  let component: ScreenContainerComponent;
  let fixture: ComponentFixture<ScreenContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NavigationModule],
        declarations: [ScreenContainerComponent],
        providers: [HealthService, { provide: ScreenService, useClass: ScreenServiceStub }],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

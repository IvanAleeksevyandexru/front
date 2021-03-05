import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { MatPeriodDescriptionComponent } from './mat-period-description.component';
import { BaseModule } from '../../../../../../shared/base.module';

describe('MatPeriodDescriptionComponent', () => {
  let component: MatPeriodDescriptionComponent;
  let fixture: ComponentFixture<MatPeriodDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatPeriodDescriptionComponent],
      imports: [MockModule(BaseModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

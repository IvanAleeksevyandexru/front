import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { MatPeriodDescriptionComponent } from './mat-period-description.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { AddZeroPennyPipe } from '../../pipe/add-zero-penny.pipe';
import { HttpClientModule } from '@angular/common/http';
import { PluralizeModule, ToMoneyModule } from '@epgu/ui/pipes';

describe('MatPeriodDescriptionComponent', () => {
  let component: MatPeriodDescriptionComponent;
  let fixture: ComponentFixture<MatPeriodDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatPeriodDescriptionComponent, AddZeroPennyPipe],
      imports: [MockModule(BaseModule), HttpClientModule, PluralizeModule, ToMoneyModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodDescriptionComponent);
    component = fixture.componentInstance;
    component.isValidBalanceAmount = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

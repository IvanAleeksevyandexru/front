import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationCenterCardComponent } from './information-center-card.component';
import { MvdInfoCenterI } from '../../interface/information-center-mvd.interface';
import { configureTestSuite } from 'ng-bullet';

describe('InformationCenterCardComponent', () => {
  let component: InformationCenterCardComponent;
  let fixture: ComponentFixture<InformationCenterCardComponent>;
  let mockData: MvdInfoCenterI = {
    attributeValues: {
      CODE: '',
      ADDRESS: '',
      FULLNAME: '',
      PHONE: '',
    },
    title: '',
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterCardComponent);
    component = fixture.componentInstance;
    component.item = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

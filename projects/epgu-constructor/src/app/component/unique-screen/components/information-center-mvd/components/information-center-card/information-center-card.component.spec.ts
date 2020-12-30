import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationCenterCardComponent } from './information-center-card.component';
import { MvdInfoCanterInterface } from '../../interface/information-center-mvd.interface';

describe('InformationCenterCardComponent', () => {
  let component: InformationCenterCardComponent;
  let fixture: ComponentFixture<InformationCenterCardComponent>;
  let mockData: MvdInfoCanterInterface = {
    attributeValues: {
      CODE: '',
      ADDRESS: '',
      FULLNAME: '',
      PHONE: '',
    },
    attributes: [],
    children: [],
    isLeaf: false,
    parentValue: null,
    title: '',
    value: '',
    id: '',
    text: '',
    unselectable: false,
    hidden: false,
    lineBreak: '',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformationCenterCardComponent]
    })
      .compileComponents();
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

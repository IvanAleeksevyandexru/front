import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { InformationCenterPfrSimpleComponent } from './information-center-pfr-simple.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { configureTestSuite } from 'ng-bullet';

describe('InformationCenterPfrSimpleComponent', () => {
  let component: InformationCenterPfrSimpleComponent;
  let fixture: ComponentFixture<InformationCenterPfrSimpleComponent>;
  const mockSimpleData = {
    items: [{ id: '1', text: 'testValue' }],
    label: 'label',
    html: '<p>html</p>',
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterPfrSimpleComponent],
      imports: [MockModule(BaseModule), MockModule(BaseComponentsModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterPfrSimpleComponent);
    component = fixture.componentInstance;
    component.simpleData = mockSimpleData;
    jest.spyOn(component.formChangeEvent, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.formChangeEvent.emit).toHaveBeenCalledWith({
      value: { territory: mockSimpleData.items[0] },
      isValid: true,
    });
  });
});

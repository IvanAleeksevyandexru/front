import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { InformationCenterSimpleComponent } from './information-center-simple.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { configureTestSuite } from 'ng-bullet';

describe('InformationCenterPfrSimpleComponent', () => {
  let component: InformationCenterSimpleComponent;
  let fixture: ComponentFixture<InformationCenterSimpleComponent>;
  const mockSimpleData = {
    items: [{ id: '1', text: 'testValue' }],
    label: 'label',
    html: '<p>html</p>',
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterSimpleComponent],
      imports: [MockModule(BaseModule), MockModule(BaseComponentsModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterSimpleComponent);
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

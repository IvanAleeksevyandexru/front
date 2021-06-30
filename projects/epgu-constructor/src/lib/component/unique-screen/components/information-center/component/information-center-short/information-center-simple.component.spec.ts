import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';

import { InformationCenterSimpleComponent } from './information-center-simple.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { Simple } from '../../information-center.models';

describe('InformationCenterPfrSimpleComponent', () => {
  let component: InformationCenterSimpleComponent;
  let fixture: ComponentFixture<InformationCenterSimpleComponent>;
  const simpleDataMock = {
    items: [{ id: '1', text: 'testValue' }],
    label: 'label',
    html: '<p>html</p>',
  } as Simple;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterSimpleComponent],
      imports: [MockModule(BaseModule), MockModule(BaseComponentsModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterSimpleComponent);
    component = fixture.componentInstance;
    component.simpleData = simpleDataMock;
    jest.spyOn(component.formChangeEvent, 'emit');
  });

  describe('setup component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call formChangeEvent', () => {
      component.ngOnInit();
  
      expect(component.formChangeEvent.emit).toHaveBeenCalledWith({
        value: { territory: simpleDataMock.items[0] },
        isValid: true,
      });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockComponent, MockModule } from 'ng-mocks';

import { InformationCenterFormComponent } from './information-center-form.component';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { InformationCenterCardComponent } from '../information-center-card/information-center-card.component';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';

describe('InformationCenterFormComponent', () => {
  let component: InformationCenterFormComponent;
  let fixture: ComponentFixture<InformationCenterFormComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterFormComponent, MockComponent(InformationCenterCardComponent)],
      imports: [
        MockModule(ConstructorDropdownModule),
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ScreenPadModule)
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterFormComponent);
    component = fixture.componentInstance;
    component.dictionaryToRequestLabel = '';
    component.sourceDictionaryLabel = '';
    component.infoCenterList = [];
    component.isLoadingInfoCenter = true;
    component.sourceList = [];
    component.select = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('InformationCenterFormComponent', () => {
    it('should be emit handleSelectEvent', () => {
      const event = {
        originalItem: {
          value: '002',
          parentValue: null,
          title: 'Республика Башкортостан',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        },
        id: '002',
        text: 'Республика Башкортостан',
      };
      jest.spyOn(component.handleSelectEvent, 'emit');
      const debugEl = fixture.debugElement.query(By.css('epgu-constructor-constructor-dropdown'));
      debugEl.triggerEventHandler('changed', event);
      expect(component.handleSelectEvent.emit).toHaveBeenCalledWith(event);
    });
  });
});

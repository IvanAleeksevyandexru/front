import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChangeListComponent, ChangeListComponentInterface } from './change-list.component';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';


describe('ChangeListComponent', () => {
  let component: ChangeListComponent;
  let fixture: ComponentFixture<ChangeListComponent>;
  let screenComponentService: ScreenComponentService;
  const mockData: ChangeListComponentInterface = {
    attrs: {
      fields: [{
        fieldName: 'name',
        label: 'Name',
        type: 'input'
      }]
    },
    id: '',
    label: '',
    type: '',
    value: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ChangeListComponent ],
      providers: [ScreenComponentService]
    })
    .compileComponents();
    screenComponentService = TestBed.inject(ScreenComponentService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeListComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

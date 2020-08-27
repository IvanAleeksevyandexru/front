import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrySelectionComponent } from './country-selection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RestServiceStub } from '../../../../services/rest/rest.service.stub';
import { RestService } from '../../../../services/rest/rest.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ModalServiceStub } from '../../../../services/modal/modal.service.stub';

// TODO: Need to refactoring component
describe.skip('CountrySelectionComponent', () => {
  let component: CountrySelectionComponent;
  let fixture: ComponentFixture<CountrySelectionComponent>;
  let mockData = {
    attrs: {
      dictionaryType: ''
    },
    label: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ReactiveFormsModule],
      declarations: [ CountrySelectionComponent ],
      providers: [
        { provide: RestService, useClass: RestServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CountrySelectionComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.form = new FormGroup({});
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

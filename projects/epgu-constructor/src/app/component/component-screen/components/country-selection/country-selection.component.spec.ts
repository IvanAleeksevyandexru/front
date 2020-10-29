import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrySelectionComponent } from './country-selection.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary-api/dictionary-api.service.stub';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { ModalServiceStub } from '../../../../shared/services/modal/modal.service.stub';

// TODO: Need to refactoring component
xdescribe('CountrySelectionComponent', () => {
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
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
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

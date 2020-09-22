import { AddNewChildFormComponent } from './add-new-child-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';


describe.skip('AddNewChildFormComponent', () => {
  let component: AddNewChildFormComponent;
  let fixture: ComponentFixture<AddNewChildFormComponent>;
  const mockData = {
    items: {
      birthDate: '',
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ FormsModule ],
      declarations: [ AddNewChildFormComponent ],
      providers: [ UnsubscribeService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewChildFormComponent);
    fixture.debugElement.injector.get(UnsubscribeService);
    component = fixture.componentInstance;
    component.item = mockData;
    fixture.detectChanges();
  });
});

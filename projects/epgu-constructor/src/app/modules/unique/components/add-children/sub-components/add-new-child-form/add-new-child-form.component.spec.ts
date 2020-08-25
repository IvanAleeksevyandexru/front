import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import { AddNewChildFormComponent } from './add-new-child-form.component';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service'
import { EpguLibModule, ɵj as ListItemsService } from 'epgu-lib'
import { TranslateService } from '@ngx-translate/core'


describe('AddNewChildFormComponent', () => {
  let component: AddNewChildFormComponent;
  let fixture: ComponentFixture<AddNewChildFormComponent>;
  const mockData = {
    childrenList: [ { birthDate: '', id: '' } ],
    child: [ { birthDate: '', id: '' } ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild(), FormsModule ],
      declarations: [ AddNewChildFormComponent ],
      providers: [ UnsubscribeService, ListItemsService, TranslateService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewChildFormComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

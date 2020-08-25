import { EpguLibModule } from 'epgu-lib'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { AddChildrenScreenComponent } from './add-children-screen.component';




describe('AddChildrenScreenComponent', () => {
  let component: AddChildrenScreenComponent;
  let fixture: ComponentFixture<AddChildrenScreenComponent>;
  const mockData: ComponentInterface = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: '{"items":[]}'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ AddChildrenScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildrenScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

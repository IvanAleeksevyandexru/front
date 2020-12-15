import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DocInputComponent } from './doc-input.component';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListModule } from '../components-list.module';

xdescribe('DocInputComponent', () => {
  let component: DocInputComponent;
  let fixture: ComponentFixture<DocInputComponent>;
  const mockData = {
    value: {
      id: 'string',
      type: 'string',
      label: 'string',
      attrs: {
        fields: {},
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [UnsubscribeService],
      imports: [ComponentsListModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocInputComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

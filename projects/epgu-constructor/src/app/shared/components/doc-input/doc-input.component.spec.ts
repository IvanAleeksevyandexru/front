import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DocInputComponent } from './doc-input.component';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { SharedModule } from '../../shared.module';
import { ComponentsListModule } from '../../../component/components-list/components-list.module';

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
      imports: [ComponentsListModule, SharedModule],
    })
    .compileComponents();
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { FieldListComponent } from './field-list.component';
import { ImgPrefixerPipe, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { OutputHtmlModule } from '../output-html/output-html.module';
import { RankPipe, SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';

describe('FieldListComponent', () => {
  let component: FieldListComponent;
  let fixture: ComponentFixture<FieldListComponent>;
  const dataMock = {
    attrs: {
      style: {},
    },
    visited: true,
    label: '',
    type: '',
    value: '',
    id: '',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FieldListComponent, SafePipe, ImgPrefixerPipe, RankPipe],
      imports: [MockModule(OutputHtmlModule)],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        EaisdoGroupCostService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldListComponent);
    component = fixture.componentInstance;
    component.data = dataMock as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

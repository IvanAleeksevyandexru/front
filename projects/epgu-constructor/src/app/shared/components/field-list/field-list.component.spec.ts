import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { SafePipe } from '../../pipes/safe/safe.pipe';
import { FieldListComponent } from './field-list.component';
import { ImgPrefixerPipe } from '../../pipes/img-prefixer/img-prefixer.pipe';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { OutputHtmlModule } from '../output-html/output-html.module';
import { RankPipe } from '../../pipes/rank/rank.pipe';
import { configureTestSuite } from 'ng-bullet';

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

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [FieldListComponent, SafePipe, ImgPrefixerPipe, RankPipe],
      imports: [MockModule(OutputHtmlModule)],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }],
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

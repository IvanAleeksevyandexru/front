import { cloneDeep } from 'lodash';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockSelectMapObjectStore } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { JusticeSearchPanelComponent } from './justice-search-panel.component';
import { ForTestsOnlyModule } from '../../../../../../../../core/for-tests-only.module';

describe('JusticeSearchPanelComponent', () => {
  let component: JusticeSearchPanelComponent;
  let fixture: ComponentFixture<JusticeSearchPanelComponent>;
  let screenService: ScreenService;
  let MapStore: ScenarioDto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JusticeSearchPanelComponent],
      imports: [ForTestsOnlyModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    MapStore = (cloneDeep(mockSelectMapObjectStore) as unknown) as ScenarioDto;
    screenService.initScreenStore(MapStore);
    fixture = TestBed.createComponent(JusticeSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

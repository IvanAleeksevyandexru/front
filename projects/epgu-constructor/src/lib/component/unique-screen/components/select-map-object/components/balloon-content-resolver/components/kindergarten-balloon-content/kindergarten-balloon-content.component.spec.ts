import { cloneDeep } from 'lodash';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YandexMapModule } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { mockKindergartenStore } from '../../../../../kindergarten/mocks/stores';
import { KindergartenSearchPanelService } from '../../../search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { KindergartenContentComponent } from './kindergarten-balloon-content.component';
import { mockKindergartenMapObject } from './mocks/map-objects';
import { ForTestsOnlyModule } from '../../../../../../../../core/for-tests-only.module';

describe('KindergartenContentComponent', () => {
  let component: KindergartenContentComponent;
  let fixture: ComponentFixture<KindergartenContentComponent>;
  let screenService: ScreenService;
  let kindergartenSearchPanelService: KindergartenSearchPanelService;
  let MapStore: ScenarioDto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KindergartenContentComponent],
      imports: [BaseModule, YandexMapModule, ForTestsOnlyModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    // @ts-ignore
    MapStore = cloneDeep(mockKindergartenStore);
    screenService.initScreenStore(MapStore);
    fixture = TestBed.createComponent(KindergartenContentComponent);
    kindergartenSearchPanelService = fixture.debugElement.injector.get(
      KindergartenSearchPanelService,
    );
    kindergartenSearchPanelService.EDUORGMAX = 10;

    component = fixture.componentInstance;
    component.selectObject = jest.fn((item) => (item.isSelected = !item.isSelected));
    component.mapObject = mockKindergartenMapObject;
    component.objectClick = () => null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calcGartens should increase and decrease deptsLeftToChoose', () => {
    const spy = jest.spyOn(component, 'calcGartens');
    const selectBtn = fixture.debugElement.query(By.css('.submit-button')).nativeElement;
    selectBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectObject).toHaveBeenCalledTimes(1);
    const cancelBtn = fixture.debugElement.query(
      By.css('div.department-selected > a.information-link'),
    ).nativeElement;
    cancelBtn.click();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

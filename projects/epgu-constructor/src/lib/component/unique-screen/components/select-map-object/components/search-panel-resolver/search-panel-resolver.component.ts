import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { DisclaimerDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { MapTypes } from '../../select-map-object.service';
import { KindergartenSearchPanelComponent } from './components/kindergarten-search-panel/kindergarten-search-panel.component';
import { CommonSearchPanelComponent } from './components/common-search-panel/common-search-panel.component';
import { ElectionsSearchPanelComponent } from './components/elections-search-panel/elections-search-panel.component';
import { JusticeSearchPanelComponent } from './components/justice-search-panel/justice-search-panel.component';

type PanelTypesComponents =
  | CommonSearchPanelComponent
  | ElectionsSearchPanelComponent
  | KindergartenSearchPanelComponent
  | JusticeSearchPanelComponent;

export const PanelTypes = {
  [MapTypes.commonMap]: 'commonPanel',
  [MapTypes.electionsMap]: 'electionsPanel',
  [MapTypes.kindergartenMap]: 'kindergartenPanel',
  [MapTypes.justiceMap]: 'justicePanel',
  undefined: 'commonPanel',
};

@Component({
  selector: 'epgu-constructor-search-panel-resolver',
  templateUrl: './search-panel-resolver.component.html',
  styleUrls: ['./search-panel-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelResolverComponent implements AfterViewInit {
  @ViewChild('panel', { read: ViewContainerRef }) panel: ViewContainerRef;

  @Input() isSearchTitleVisible = true;
  @Input() isNoDepartmentErrorVisible = false;
  @Input() label: string;
  @Input() noDepartmentsErrorMsg: string;
  @Input() showNav: boolean;
  @Input() disclaimer: DisclaimerDto;
  @Input() panelType = PanelTypes[MapTypes.commonMap];

  private panelsMap = {
    [PanelTypes[MapTypes.commonMap]]: CommonSearchPanelComponent,
    [PanelTypes[MapTypes.electionsMap]]: ElectionsSearchPanelComponent,
    [PanelTypes[MapTypes.kindergartenMap]]: KindergartenSearchPanelComponent,
    [PanelTypes[MapTypes.justiceMap]]: JusticeSearchPanelComponent,
  };

  constructor(
    public screenService: ScreenService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.addPanel();
    this.cdr.markForCheck();
  }

  public addPanel(): void {
    const panel = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponent(this.panelType),
    );
    this.panel.createComponent(panel);
  }

  private getComponent(type: string): Type<PanelTypesComponents> {
    return this.panelsMap[type];
  }
}

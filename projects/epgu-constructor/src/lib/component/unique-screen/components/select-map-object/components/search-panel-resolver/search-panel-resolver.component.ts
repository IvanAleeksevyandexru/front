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
import { CommonSearchPanelComponent } from './components/common-search-panel/common-search-panel.component';
import { ElectionsSearchPanelComponent } from './components/elections-search-panel/elections-search-panel.component';

type PanelTypesComponents = CommonSearchPanelComponent | ElectionsSearchPanelComponent;

export enum PanelTypes {
  commonPanel = 'commonPanel',
  electionsPanel = 'electionsPanel',
}

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
  @Input() panelType = PanelTypes.commonPanel;
  @Input() disclaimer: DisclaimerDto;

  private panelsMap = {
    [PanelTypes.commonPanel]: CommonSearchPanelComponent,
    [PanelTypes.electionsPanel]: ElectionsSearchPanelComponent,
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

  private getComponent(type: PanelTypes): Type<PanelTypesComponents> {
    return this.panelsMap[type];
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';

@Component({
  selector: 'epgu-constructor-elections-balloon-content',
  templateUrl: './elections-balloon-content.component.html',
  styleUrls: ['./elections-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionsBalloonContentComponent implements AfterViewInit, IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader = false;
  @Input() mapObject;
  public selectObject: Function;
  public expandObject: Function;
  public extInfo$: Observable<unknown>;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.extInfo$ = this.selectMapObjectService.getElections(
      this.mapObject.pollStationNumber,
      this.mapObject.pollStationRegion,
      this.selectMapObjectService.componentAttrs.electionDate,
      this.selectMapObjectService.componentAttrs.electionLevel,
    );
    this.cdr.markForCheck();
  }
}

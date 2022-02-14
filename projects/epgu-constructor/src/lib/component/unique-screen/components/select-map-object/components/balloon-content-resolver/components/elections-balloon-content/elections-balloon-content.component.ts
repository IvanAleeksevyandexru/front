import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { DeviceDetectorService, flyInOut } from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DictionaryYMapItem } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';
import { Ielection, IuikFullDataResponse } from './elections-balloon-content.interface';

@Component({
  selector: 'epgu-constructor-elections-balloon-content',
  templateUrl: './elections-balloon-content.component.html',
  styleUrls: ['./elections-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [flyInOut],
})
export class ElectionsBalloonContentComponent implements AfterViewInit, IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader: Observable<boolean>;
  @Input() mapObjects: DictionaryYMapItem[];
  @Input() attrs;
  public selectObject: Function;
  public objectClick: Function;
  public collapseObject: Function;
  public extInfo$: Observable<IuikFullDataResponse>;
  public electionForDisclaimer: Ielection;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public deviceDetector: DeviceDetectorService,
  ) {}

  public ngAfterViewInit(): void {
    if (this.mapObjects[0]) {
      this.extInfo$ = this.selectMapObjectService
        .getElections(
          this.mapObjects[0].pollStationNumber,
          this.mapObjects[0].pollStationRegion,
          this.selectMapObjectService.componentAttrs.electionDate,
          this.selectMapObjectService.componentAttrs.electionLevel,
        )
        .pipe(
          tap((response) => {
            this.electionForDisclaimer = response.elections.find(
              (election) => !election.userDistrictEqalUikDistrict,
            );
            window.requestAnimationFrame(() => this.cdr.detectChanges());
          }),
        );
      this.cdr.detectChanges();
    }
  }

  public headerClick(): void {
    this.mapObjects[0].expanded = !this.mapObjects[0].expanded;
  }
}

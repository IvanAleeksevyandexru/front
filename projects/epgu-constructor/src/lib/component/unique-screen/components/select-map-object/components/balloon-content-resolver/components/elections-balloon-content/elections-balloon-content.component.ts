import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';
import { IuikFullDataResponse } from './elections-balloon-content.interface';

@Component({
  selector: 'epgu-constructor-elections-balloon-content',
  templateUrl: './elections-balloon-content.component.html',
  styleUrls: ['./elections-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionsBalloonContentComponent implements AfterViewInit, IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader: Observable<boolean>;
  @Input() mapObject;
  @Input() attrs;
  public selectObject: Function;
  public expandObject: Function;
  public extInfo$: Observable<IuikFullDataResponse>;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.extInfo$ = this.selectMapObjectService
      .getElections(
        this.mapObject.pollStationNumber,
        this.mapObject.pollStationRegion,
        this.selectMapObjectService.componentAttrs.electionDate,
        this.selectMapObjectService.componentAttrs.electionLevel,
      )
      .pipe(
        delay(0), // TODO: проверить необходимость делея, убрать если не нужен
        tap(() => this.cdr.detectChanges()),
      );
    this.cdr.detectChanges();
  }
}

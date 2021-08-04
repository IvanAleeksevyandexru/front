import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { concatMap, filter, finalize, map, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ConfigService, ModalService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import { IdentificationApiService } from '../../shared/identification-api/identification-api.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';

import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-identification-stream',
  templateUrl: './identification-stream.component.html',
  styleUrls: ['./identification-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class IdentificationStreamComponent {
  attrs = this.screenService.component?.attrs;
  component = this.screenService.component;
  display = this.screenService.display;
  header$: Observable<string> = combineLatest([
    this.screenService.component$,
    this.screenService.header$,
  ]).pipe(map(([data, header]: [ComponentBase, string]) => header || data.label));

  isLoading$: Observable<boolean> = this.screenService.isLoading$;

  result?: UploadedFile;
  apiLoading$ = new BehaviorSubject<boolean>(false);

  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    type: ActionType.nextStep,
  };

  constructor(
    public screenService: ScreenService,
    public config: ConfigService,
    public navigationService: NavigationService,
    private modalService: ModalService,
    private api: IdentificationApiService,
    private tera: TerraByteApiService,
    private cdr: ChangeDetectorRef,
    private actionService: ActionService,
    private ngUnsubscribe$: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  mnemonic(): string {
    return `${this.component.id}.IdentificationStreamComponent.test.0`;
  }
  record(): void {
    this.modalService
      .openModal<{ file?: File; status?: boolean }>(VideoModalComponent)
      .pipe(
        filter((v) => v !== null),
        concatMap(({ file }) =>
          this.tera.uploadFile(
            {
              name: 'frame',
              mimeType: 'image/png',
              objectId: `${this.screenService.orderId}`,
              objectType: 2,
              mnemonic: this.mnemonic(),
            },
            file,
          ),
        ),
        concatMap(() =>
          this.tera.getFileInfo({
            objectId: `${this.screenService.orderId}`,
            objectType: 2,
            mnemonic: this.mnemonic(),
          }),
        ),
      )
      .subscribe((result) => {
        this.result = result;
        this.cdr.detectChanges();
      });
  }

  next(): void {
    const selfieFaceId = this.screenService.component?.arguments?.selfieId as string;
    const faceId = this.screenService.component?.arguments?.faceId as string;
    of(1)
      .pipe(
        tap(() => this.apiLoading$.next(true)),
        concatMap(() =>
          this.api
            .videoIdentification({
              faceId,
              selfieFaceId,
              snapshot: this.result,
            })
            .pipe(finalize(() => this.apiLoading$.next(false))),
        ),
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        this.currentAnswersService.state = { ...result };
        this.nextStep();
      });
  }
  private nextStep(): void {
    this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
  }
}

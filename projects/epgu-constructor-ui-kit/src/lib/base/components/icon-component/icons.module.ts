import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconResolverComponent } from './icon-resolver.component';
import { ProgressFormIconComponent } from './progress-form-icon/progress-form-icon.component';
import { CompleteFormIconComponent } from './complete-form-icon/complete-form-icon.component';
import { MoveIconComponent } from './move-icon/move-icon.component';
import { ZoomOutIconComponent } from './zoom-out-icon/zoom-out-icon.component';
import { ZoomInComponent } from './zoom-in-icon/zoom-in.component';
import { RotateComponent } from './rotate-icon/rotate.component';
import { ListFirstIconComponent } from './list-first-icon/list-first-icon.component';
import { ListSecondIconComponent } from './list-second-icon/list-second-icon.component';
import { PencilLineIconComponent } from './pencil-line-icon/pencil-line-icon.component';
import { CopyIconComponent } from './copy-icon/copy-icon.component';
import { ClipIconComponent } from './clip-icon/clip-icon.component';
import { CameraIconComponent } from './camera-icon/camera-icon.component';
import { DirectionArrowIconComponent } from './direction-arrow-icon/direction-arrow-icon.component';
import { DownloadIconComponent } from './download-icon/download-icon.component';
import { ZoomInMagnifyingGlassIconComponent } from './zoom-in-magnifying-glass-icon/zoom-in-magnifying-glass-icon.component';
import { ZoomOutMagnifyingGlassIconComponent } from './zoom-out-magnifying-glass-icon/zoom-out-magnifying-glass-icon.component';
import { ClockIconComponent } from './clock-icon/clock-icon.component';
import { TrashIconComponent } from './trash-icon/trash-icon.component';
import { CurveArrowIconComponent } from './curve-arrow-icon/curve-arrow-icon.component';
import { PlusIconComponent } from './plus-icon/plus-icon.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { MapIconComponent } from './map-icon/map-icon.component';
import { FilterIconComponent } from './filter-icon/filter-icon.component';
import { DeleteIconComponent } from './delete-icon/delete-icon.component';

@NgModule({
  declarations: [
    IconResolverComponent,
    ProgressFormIconComponent,
    CompleteFormIconComponent,
    MoveIconComponent,
    ZoomOutIconComponent,
    ZoomInComponent,
    RotateComponent,
    ListFirstIconComponent,
    ListSecondIconComponent,
    PencilLineIconComponent,
    CopyIconComponent,
    ClipIconComponent,
    CameraIconComponent,
    ClockIconComponent,
    DownloadIconComponent,
    TrashIconComponent,
    CurveArrowIconComponent,
    PlusIconComponent,
    MenuIconComponent,
    MapIconComponent,
    DirectionArrowIconComponent,
    ZoomInMagnifyingGlassIconComponent,
    ZoomOutMagnifyingGlassIconComponent,
    FilterIconComponent,
    DeleteIconComponent,
  ],
  imports: [CommonModule],
  exports: [IconResolverComponent],
})
export class IconsModule {}

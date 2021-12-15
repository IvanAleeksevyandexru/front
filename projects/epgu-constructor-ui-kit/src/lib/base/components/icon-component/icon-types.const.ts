import { Type } from '@angular/core';
import { CameraIconComponent } from './camera-icon/camera-icon.component';
import { ClipIconComponent } from './clip-icon/clip-icon.component';
import { CompleteFormIconComponent } from './complete-form-icon/complete-form-icon.component';
import { CopyIconComponent } from './copy-icon/copy-icon.component';
import { DirectionArrowIconComponent } from './direction-arrow-icon/direction-arrow-icon.component';
import { ListFirstIconComponent } from './list-first-icon/list-first-icon.component';
import { ListSecondIconComponent } from './list-second-icon/list-second-icon.component';
import { MoveIconComponent } from './move-icon/move-icon.component';
import { PencilLineIconComponent } from './pencil-line-icon/pencil-line-icon.component';
import { ProgressFormIconComponent } from './progress-form-icon/progress-form-icon.component';
import { RotateComponent } from './rotate-icon/rotate.component';
import { VideoIconComponent } from './video-icon/video-icon.component';
import { ZoomInComponent } from './zoom-in-icon/zoom-in.component';
import { ZoomOutIconComponent } from './zoom-out-icon/zoom-out-icon.component';
import { IconType } from './IconType';
import { ClockIconComponent } from './clock-icon/clock-icon.component';
import { DownloadIconComponent } from './download-icon/download-icon.component';
import { TrashIconComponent } from './trash-icon/trash-icon.component';
import { ZoomInMagnifyingGlassIconComponent } from './zoom-in-magnifying-glass-icon/zoom-in-magnifying-glass-icon.component';
import { ZoomOutMagnifyingGlassIconComponent } from './zoom-out-magnifying-glass-icon/zoom-out-magnifying-glass-icon.component';
import { CurveArrowIconComponent } from './curve-arrow-icon/curve-arrow-icon.component';
import { PlusIconComponent } from './plus-icon/plus-icon.component';
import { MapIconComponent } from './map-icon/map-icon.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { FilterIconComponent } from './filter-icon/filter-icon.component';

type IconComponent =
  | CameraIconComponent
  | ClipIconComponent
  | CompleteFormIconComponent
  | CopyIconComponent
  | DirectionArrowIconComponent
  | ListFirstIconComponent
  | ListSecondIconComponent
  | MoveIconComponent
  | PencilLineIconComponent
  | ProgressFormIconComponent
  | RotateComponent
  | VideoIconComponent
  | ZoomInComponent
  | ZoomOutIconComponent
  | ClockIconComponent
  | DownloadIconComponent
  | TrashIconComponent
  | ZoomInMagnifyingGlassIconComponent
  | ZoomOutMagnifyingGlassIconComponent
  | CurveArrowIconComponent
  | PlusIconComponent
  | MenuIconComponent
  | MapIconComponent
  | FilterIconComponent;

export const IconTypeToComponent: Partial<Record<IconType, Type<IconComponent>>> = {
  ProgressForm: ProgressFormIconComponent,
  CompleteForm: CompleteFormIconComponent,
  MoveIcon: MoveIconComponent,
  ZoomOut: ZoomOutIconComponent,
  ZoomIn: ZoomInComponent,
  Rotate: RotateComponent,
  Video: VideoIconComponent,
  ListFirst: ListFirstIconComponent,
  ListSecond: ListSecondIconComponent,
  PencilLine: PencilLineIconComponent,
  Copy: CopyIconComponent,
  Clip: ClipIconComponent,
  Camera: CameraIconComponent,
  DirectionArrow: DirectionArrowIconComponent,
  Clock: ClockIconComponent,
  Download: DownloadIconComponent,
  Trash: TrashIconComponent,
  ZoomInMagnifyingGlass: ZoomInMagnifyingGlassIconComponent,
  ZoomOutMagnifyingGlass: ZoomOutMagnifyingGlassIconComponent,
  CurveArrow: CurveArrowIconComponent,
  Plus: PlusIconComponent,
  Menu: MenuIconComponent,
  Map: MapIconComponent,
  Filter: FilterIconComponent,
};

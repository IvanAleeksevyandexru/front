import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { filter, tap } from 'rxjs/operators';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { ZoomEvent } from './typings';

@Component({
  selector: 'epgu-constructor-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomComponent implements OnInit, OnDestroy {
  @Input() imageURL: string;
  @ViewChild('el', { static: true }) el: ElementRef<HTMLImageElement>;
  @Output() moveStart = new EventEmitter<null>();
  @Output() moveEnd = new EventEmitter<null>();
  @Output() zoom = new EventEmitter<ZoomEvent>();

  x = 0;
  y = 0;
  lastX = 0;
  lastY = 0;
  maxX = 0;
  maxY = 0;
  lastZoom = 1;
  isTouch =
    this.deviceService.isMobile || this.deviceService.isTablet || this.deviceService.isWebView;
  zoom$$: BehaviorSubject<number> = new BehaviorSubject(1);
  speedZoom = 0.2;
  maxZoom = 1;
  minZoom = 1;
  isMove = false;

  subs = new Subscription().add(
    this.zoom$$.pipe(tap((zoom) => this.zoom.emit({ zoom, max: this.maxZoom }))).subscribe(),
  );

  mousemove$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
    filter((e) => this.targetFilter(e)),
    filter(() => this.isMove && this.zoom$$.getValue() > this.minZoom),
    tap((e) => this.moveHandler(e)),
  );

  mousewheel$ = fromEvent<WheelEvent>(this.document, 'mousewheel').pipe(
    filter((e) => this.targetFilter(e)),
    tap((e: WheelEvent) => this.zoomHandler(e)),
  );

  mousedown$ = fromEvent<MouseEvent>(this.document, 'mousedown').pipe(
    filter((e) => this.targetFilter(e)),
    tap(() => {
      this.moveStart.emit();
      this.isMove = true;
    }),
  );

  mouseup$ = fromEvent(this.document, 'mouseup').pipe(
    filter(() => this.isMove),
    tap(() => {
      this.moveEnd.emit();
      this.isMove = false;
    }),
  );

  constructor(
    private deviceService: DeviceDetectorService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (this.el?.nativeElement) {
      this.checkAvailable(this.el.nativeElement);
    }
  }

  getZoom(): number {
    return this.zoom$$.getValue();
  }

  loadImage(): void {
    this.updateZoomLimits();
    this.zoom$$.next(this.getZoom());
  }

  updateZoomLimits(): void {
    const { clientWidth, naturalWidth } = this.el.nativeElement;
    const naturalMax = 1 + (naturalWidth - clientWidth) / clientWidth;
    this.maxZoom = naturalMax > 1 ? naturalMax : 1;
  }

  targetFilter(ev: Event): boolean {
    return ev.target === this.el?.nativeElement;
  }

  ngOnInit(): void {
    this.initSubscribes();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initSubscribes(): void {
    if (!this.isTouch) {
      this.subs
        .add(this.mousemove$.subscribe())
        .add(this.mousewheel$.subscribe())
        .add(this.mousedown$.subscribe())
        .add(this.mouseup$.subscribe());
    }
  }

  zoomHandler(event: WheelEvent): void {
    this.zoomCompute(event.deltaY);
  }

  zoomIn(): void {
    this.updateZoomLimits();
    this.changeZoom(this.maxZoom);
  }

  zoomOut(): void {
    this.changeZoom(this.zoom$$.getValue() - this.speedZoom);
  }

  resetZoom(): void {
    this.changeZoom(this.minZoom);
  }

  updateSize(): void {
    this.checkAvailable(this.el.nativeElement);
    this.updateStyle();
  }

  changeZoom(zoom: number): void {
    this.updateZoomLimits();
    const minZoom = zoom < this.minZoom ? this.minZoom : zoom;

    this.zoom$$.next(zoom > this.maxZoom ? this.maxZoom : minZoom);
    this.updateSize();
  }

  zoomCompute(delta: number): void {
    const direction = delta < 0 ? 1 : -1;
    const zoom =
      direction === -1
        ? this.zoom$$.getValue() - this.speedZoom
        : this.zoom$$.getValue() + this.speedZoom;

    this.x = 0;
    this.y = 0;
    this.changeZoom(zoom);
  }

  getAvailableSize(target: Element): { h: number; w: number } {
    const parent = target.parentNode as Element;
    const availableHeight =
      (target.clientHeight * this.zoom$$.getValue() - parent.clientHeight) /
      2 /
      this.zoom$$.getValue();
    const availableWidth =
      (target.clientWidth * this.zoom$$.getValue() - parent.clientWidth) /
      2 /
      this.zoom$$.getValue();
    return { h: availableHeight, w: availableWidth };
  }

  checkAvailable(target: Element): void {
    const available = this.getAvailableSize(target);
    const parent = target.parentNode as Element;
    if (this.x > 0 && this.x > available.w) {
      this.x = available.w;
    }
    if (this.x < 0 && this.x < -available.w) {
      this.x = -available.w;
    }
    if (this.y > 0 && this.y > available.h) {
      this.y = available.h;
    }
    if (this.y < 0 && this.y < -available.h) {
      this.y = -available.h;
    }
    if (target.clientHeight * this.zoom$$.getValue() < parent.clientHeight) {
      this.y = 0;
    }
    if (target.clientWidth * this.zoom$$.getValue() < parent.clientWidth) {
      this.x = 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pinchZoom(ev: any): void {
    if (!this.isTouch) {
      return;
    }
    this.updateZoomLimits();

    if (this.zoom$$.getValue() !== 1) {
      this.x = this.lastX + ev.deltaX;
      this.y = this.lastY + ev.deltaY;
      this.maxX = Math.ceil(((this.zoom$$.getValue() - 1) * ev.target.clientWidth) / 2);
      this.maxY = Math.ceil(((this.zoom$$.getValue() - 1) * ev.target.clientHeight) / 2);
      if (this.x > this.maxX) {
        this.x = this.maxX;
      }
      if (this.x < -this.maxX) {
        this.x = -this.maxX;
      }
      if (this.y > this.maxY) {
        this.y = this.maxY;
      }
      if (this.y < -this.maxY) {
        this.y = -this.maxY;
      }
    }

    if (ev.type === 'pinch') {
      this.zoom$$.next(Math.max(0.999, Math.min(this.lastZoom * ev.scale, this.maxZoom)));
    }
    if (ev.type === 'pinchend') {
      this.lastZoom = this.zoom$$.getValue();
    }
    if (ev.type === 'panend') {
      this.lastX = this.x < this.maxX ? this.x : this.maxX;
      this.lastY = this.y < this.maxY ? this.y : this.maxY;
    }

    if (this.zoom$$.getValue() > this.maxZoom) {
      this.lastZoom = this.zoom$$.getValue();
      this.zoom$$.next(this.maxZoom);
    }
    if (this.zoom$$.getValue() !== 1) {
      this.checkAvailable(ev.target as Element);
      this.updateStyle();
    }
  }

  moveHandler(event: MouseEvent): void {
    this.x += event.movementX;
    this.y += event.movementY;
    this.checkAvailable(event.target as Element);

    this.updateStyle();
  }

  updateStyle(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `scale3d(${this.zoom$$.getValue()}, ${this.zoom$$.getValue()}, 1) translate3d(${this.x}px, ${
        this.y
      }px, 0px)`,
    );
  }
}

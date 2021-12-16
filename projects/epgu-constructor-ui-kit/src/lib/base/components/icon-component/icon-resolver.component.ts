import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  ComponentFactoryResolver,
  ComponentFactory,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  AfterViewInit,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';

import { IconTypeToComponent } from './icon-types.const';
import { BaseIconComponent } from './base-icon.component';
import { IconType } from './IconType';
import { IconColor } from './IconColor';

@Component({
  selector: 'epgu-cf-ui-icon',
  templateUrl: './icon-resolver.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class IconResolverComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('iconContainer', { read: ViewContainerRef }) iconContainer: ViewContainerRef;
  @HostBinding('style.width.px') get hostWidth(): number {
    return this.width;
  }

  @HostBinding('style.height.px') get hostHeight(): number {
    return this.height;
  }
  @Input() type: IconType;
  @Input() mainColor: IconColor;
  @Input() hoverColor: IconColor;
  @Input() activeColor: IconColor;
  @Input() isActive = false;
  @Input() width = 24;
  @Input() height = 24;
  public color: string;
  public iconComponentRef: ComponentRef<BaseIconComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {}

  @HostListener('mouseenter', ['$event.target'])
  handleMouseEnter(): void {
    if (this.hoverColor) {
      this.iconComponentRef.instance.color = this.hoverColor;
    }
  }

  @HostListener('mouseleave', ['$event.target'])
  handleMouseLeave(): void {
    this.iconComponentRef.instance.color = this.getColor();
  }

  ngOnInit(): void {
    this.color = this.getColor();
  }

  ngAfterViewInit(): void {
    this.createComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isActive' in changes && this.iconComponentRef) {
      this.iconComponentRef.instance.color = changes.isActive.currentValue
        ? this.activeColor
        : this.mainColor;
    }
  }

  private createComponent(): void {
    const component = IconTypeToComponent[this.type];
    const componentFactory: ComponentFactory<BaseIconComponent> = this.componentFactoryResolver.resolveComponentFactory(
      component,
    );
    this.iconComponentRef = this.iconContainer.createComponent<BaseIconComponent>(componentFactory);

    this.iconComponentRef.instance.color = this.color;
    this.iconComponentRef.instance.width = this.width;
    this.iconComponentRef.instance.height = this.height;

    this.cdr.detectChanges();
  }

  private getColor(): string {
    return this.isActive ? this.activeColor : this.mainColor;
  }
}

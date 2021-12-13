import { Injectable } from '@angular/core';
import { IFeatureItem } from '../yandex-map.interface';
import { OBJECT_APPEAR_DURATION, TOTAL_OBJECTS_APPEAR_DURATION } from './MAP_ANIMATION_CONSTANTS';

@Injectable()
export class MapAnimationService {
  private animatedIds: (string | number)[] = [];

  private animationStep: number;

  private currentStep = 0;

  private _firstLoading = true;

  get firstLoading(): boolean {
    if (this._firstLoading) {
      this._firstLoading = false;
      return true;
    }
    return false;
  }

  public setInitData(mapObjects: IFeatureItem<unknown>[]): void {
    this.animatedIds = mapObjects.map((point) => point.id);
    this.animationStep = TOTAL_OBJECTS_APPEAR_DURATION / mapObjects.length;
  }

  public handleElementAppearAnimation(element: HTMLElement, objectId: number): void {
    if (this.shouldAnimate(objectId)) {
      element.classList.add('hidden');
      const animationDelay = this.getDelay();
      setTimeout(() => {
        element.classList.remove('hidden');
        element.style.animationName = 'show-map-object';
        element.style.animationDuration = `${OBJECT_APPEAR_DURATION}s`;
      }, animationDelay);
    }
  }

  private getDelay(): number {
    this.currentStep++;
    return this.animationStep * this.currentStep;
  }

  private shouldAnimate(pointId: number): boolean {
    const idx = this.animatedIds.findIndex((id) => id === pointId);
    if (idx !== -1) {
      this.animatedIds.splice(idx, 1);
      return true;
    }
    return false;
  }
}

import { trigger, transition, style, animate } from '@angular/animations';

export const smoothHeight = trigger('grow', [
  transition('void <=> *', []),
  transition('* <=> *', [style({ height: '{{startHeight}}px', opacity: 0 }), animate('.4s ease')], {
    params: { startHeight: 0 },
  }),
]);

export const flyInOut = trigger('flyInOut', [
  transition('void => *', [style({ opacity: 0, transform: 'translateY(100%)' }), animate(600)]),
  transition('* => void', [animate(600, style({ opacity: 0, transform: 'translateY(100%)' }))]),
]);

export const rotateAndDiminish = trigger('rotateAndDiminish', [
  transition('* => void', [animate(300, style({ transform: 'scale(0) rotate(-90deg)' }))]),
]);

export const PIN_ACTIVATION_DURATION = 0.35;
export const OBJECT_APPEAR_DURATION = 0.35;
export const TOTAL_OBJECTS_APPEAR_DURATION = 1000;

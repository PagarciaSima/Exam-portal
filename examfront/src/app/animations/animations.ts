import { trigger, transition, style, animate } from '@angular/animations';

export const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ])
]);

export const fadeInUp = trigger('fadeInUp', [
    transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
])
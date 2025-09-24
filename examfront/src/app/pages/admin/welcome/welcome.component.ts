import { Component, OnInit } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';

/**
 * The `WelcomeComponent` is an Angular component that serves as the welcome page for the admin section.
 * 
 * @remarks
 * This component uses the `slideIn` animation and is associated with the `welcome.component.html` template and `welcome.component.css` styles.
 * 
 * @example
 * ```html
 * <app-welcome></app-welcome>
 * ```
 * 
 * @see {@link OnInit}
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [
    slideIn
  ]
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

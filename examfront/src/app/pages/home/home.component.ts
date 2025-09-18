import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
      trigger('fadeInUp', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

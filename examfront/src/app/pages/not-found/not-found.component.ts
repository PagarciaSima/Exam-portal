import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { slideIn } from 'src/app/animations/animations';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  animations: [
    slideIn
  ]
})
export class NotFoundComponent {

  constructor(private location: Location) {

  }
  
  goBack() {
    this.location.back();
  }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

/**
 * DashboardComponent is responsible for displaying the admin dashboard page.
 * 
 * This component serves as the main entry point for admin-related dashboard features.
 * It initializes any required logic when the component is loaded.
 *
 * @example
 * <app-dashboard></app-dashboard>
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  
}

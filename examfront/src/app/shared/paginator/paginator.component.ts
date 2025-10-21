import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {
  @Input() page = 0;
  @Input() totalPages = 1;
  @Input() range = 5;
  @Output() pageChange = new EventEmitter<number>();

  get pageNumbers(): number[] {
    let start = Math.max(0, this.page - Math.floor(this.range / 2));
    let end = start + this.range;
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(0, end - this.range);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages && page !== this.page) {
      this.pageChange.emit(page);
    }
  }
}
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.css']
})
export class SearcherComponent implements OnInit {

  @Input() placeholder: string = 'Buscar...';
  @Input() ariaLabel: string = 'Buscar';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onInputChange(newValue: string) {
    this.valueChange.emit(newValue);
  }

  clearInput() {
    this.value = '';
    this.valueChange.emit(this.value);
  }

}

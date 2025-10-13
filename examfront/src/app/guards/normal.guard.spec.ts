import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // <--- Importa esto

import { NormalGuard } from './normal.guard';

describe('NormalGuard', () => {
  let guard: NormalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // <--- Añadido
    });
    guard = TestBed.inject(NormalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Cartera } from './cartera';

describe('Cartera', () => {
  let service: Cartera;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cartera);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

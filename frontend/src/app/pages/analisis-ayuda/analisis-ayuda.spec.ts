import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisAyuda } from './analisis-ayuda';

describe('AnalisisAyuda', () => {
  let component: AnalisisAyuda;
  let fixture: ComponentFixture<AnalisisAyuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisAyuda],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalisisAyuda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

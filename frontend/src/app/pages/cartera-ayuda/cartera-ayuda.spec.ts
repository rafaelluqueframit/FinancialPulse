import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraAyuda } from './cartera-ayuda';

describe('CarteraAyuda', () => {
  let component: CarteraAyuda;
  let fixture: ComponentFixture<CarteraAyuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraAyuda],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteraAyuda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraComponent } from './cartera.component';

describe('Cartera', () => {
  let component: CarteraComponent;
  let fixture: ComponentFixture<CarteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteraComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

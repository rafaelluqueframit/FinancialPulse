import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarNoticias } from './buscar-noticias';

describe('BuscarNoticias', () => {
  let component: BuscarNoticias;
  let fixture: ComponentFixture<BuscarNoticias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarNoticias],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarNoticias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

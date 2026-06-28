import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasAyuda } from './noticias-ayuda';

describe('NoticiasAyuda', () => {
  let component: NoticiasAyuda;
  let fixture: ComponentFixture<NoticiasAyuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasAyuda],
    }).compileComponents();

    fixture = TestBed.createComponent(NoticiasAyuda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

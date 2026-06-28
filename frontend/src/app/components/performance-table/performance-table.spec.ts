import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceTable } from './performance-table';

describe('PerformanceTable', () => {
  let component: PerformanceTable;
  let fixture: ComponentFixture<PerformanceTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

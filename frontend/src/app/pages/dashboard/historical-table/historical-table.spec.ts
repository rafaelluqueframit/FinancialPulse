import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalTable } from './historical-table';

describe('HistoricalTable', () => {
  let component: HistoricalTable;
  let fixture: ComponentFixture<HistoricalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalTable],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

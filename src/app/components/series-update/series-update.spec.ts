import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesUpdate } from './series-update';

describe('SeriesUpdate', () => {
  let component: SeriesUpdate;
  let fixture: ComponentFixture<SeriesUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

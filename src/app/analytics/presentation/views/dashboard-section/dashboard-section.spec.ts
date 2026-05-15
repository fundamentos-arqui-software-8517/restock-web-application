import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSection } from './dashboard-section';

describe('DashboardSection', () => {
  let component: DashboardSection;
  let fixture: ComponentFixture<DashboardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSection],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSupplySection } from './custom-supply-section';

describe('CustomSupplySection', () => {
  let component: CustomSupplySection;
  let fixture: ComponentFixture<CustomSupplySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSupplySection],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSupplySection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

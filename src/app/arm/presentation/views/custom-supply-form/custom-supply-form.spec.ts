import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSupplyForm } from './custom-supply-form';

describe('CustomSupplyForm', () => {
  let component: CustomSupplyForm;
  let fixture: ComponentFixture<CustomSupplyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSupplyForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSupplyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

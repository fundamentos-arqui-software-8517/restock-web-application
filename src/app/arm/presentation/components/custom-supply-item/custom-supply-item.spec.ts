import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSupplyItem } from './custom-supply-item';

describe('CustomSupplyItem', () => {
  let component: CustomSupplyItem;
  let fixture: ComponentFixture<CustomSupplyItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSupplyItem],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSupplyItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSupplyList } from './custom-supply-list';

describe('CustomSupplyList', () => {
  let component: CustomSupplyList;
  let fixture: ComponentFixture<CustomSupplyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSupplyList],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSupplyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

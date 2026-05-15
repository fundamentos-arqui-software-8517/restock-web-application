import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSection } from './recipe-section';

describe('RecipeSection', () => {
  let component: RecipeSection;
  let fixture: ComponentFixture<RecipeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeSection],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

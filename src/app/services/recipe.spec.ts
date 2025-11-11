import { TestBed } from '@angular/core/testing';
import { RecipeDetailPage } from '../recipe-detail/recipe-detail.page';

// import { Recipe } from './recipe';

describe('Recipe', () => {
  let service: RecipeDetailPage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDetailPage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

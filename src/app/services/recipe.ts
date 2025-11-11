import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Recipe, RecipesResponse } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  // Search recipes by name
  searchRecipes(query: string): Observable<RecipesResponse> {
    if (!query.trim()) {
      return of({ meals: null });
    }
    
    return this.http.get<RecipesResponse>(`${this.apiUrl}/search.php?s=${query}`)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  // Get recipe by ID
  getRecipeById(id: string): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(`${this.apiUrl}/lookup.php?i=${id}`)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  // Extract ingredients from recipe (helper method)
  getIngredients(recipe: Recipe): { ingredient: string; measure: string }[] {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
      const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    
    return ingredients;
  }
}
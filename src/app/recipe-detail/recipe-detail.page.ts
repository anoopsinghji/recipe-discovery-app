import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons, 
  IonIcon, 
 
  IonSpinner,
  IonFab,
  IonFabButton,
  IonFabList,
  AlertController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { RecipeService } from '../services/recipe';
import { AuthService } from '../services/login';
import { Recipe } from '../models/recipe.model';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons, 
    IonIcon, 
  
    IonSpinner,
    IonFab,
    IonFabButton,
    IonFabList
  ]
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe | null = null;
  isLoading: boolean = true;
  ingredients: { ingredient: string; measure: string }[] = [];
  isFavorite: boolean = false;
  similarRecipes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    // Check authentication
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return;
    }

    const recipeId = this.route.snapshot.paramMap.get('id');
    
    if (recipeId) {
      this.loadRecipe(recipeId);
      this.checkIfFavorite(recipeId);
      this.loadSimilarRecipes();
    } else {
      this.router.navigate(['/home']);
    }
  }

  loadRecipe(id: string) {
    this.isLoading = true;
    
    this.recipeService.getRecipeById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.meals && response.meals.length > 0) {
          this.recipe = response.meals[0];
          this.ingredients = this.recipeService.getIngredients(this.recipe);
        } else {
          this.recipe = null;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading recipe:', error);
        this.router.navigate(['/home']);
      }
    });
  }

  loadSimilarRecipes() {
    // For demo purposes, we'll create some mock similar recipes
    // In a real app, you would fetch similar recipes from the API
    this.similarRecipes = [
      {
        idMeal: '52772',
        strMeal: 'Teriyaki Chicken Casserole',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
        strCategory: 'Chicken'
      },
      {
        idMeal: '52850',
        strMeal: 'Chicken Couscous',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/qxytrx1511304021.jpg',
        strCategory: 'Chicken'
      },
      {
        idMeal: '52940',
        strMeal: 'Brown Stew Chicken',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg',
        strCategory: 'Chicken'
      },
      {
        idMeal: '52956',
        strMeal: 'Chicken Fajita Mac and Cheese',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/qrqywr1503066605.jpg',
        strCategory: 'Chicken'
      }
    ];
  }

  checkIfFavorite(recipeId: string) {
    const favorites = this.getFavorites();
    this.isFavorite = favorites.includes(recipeId);
  }

  toggleFavorite() {
    if (!this.recipe) return;

    const favorites = this.getFavorites();
    
    if (this.isFavorite) {
      // Remove from favorites
      const index = favorites.indexOf(this.recipe.idMeal);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    } else {
      // Add to favorites
      favorites.push(this.recipe.idMeal);
    }
    
    this.saveFavorites(favorites);
    this.isFavorite = !this.isFavorite;
    
    // Show feedback
    this.showToast(this.isFavorite ? 'Added to favorites' : 'Removed from favorites');
  }

  async shareRecipe() {
    if (!this.recipe) return;

    const actionSheet = await this.actionSheetController.create({
      header: 'Share Recipe',
      buttons: [
        {
          text: 'Copy Link',
          icon: 'link',
          handler: () => {
            this.copyToClipboard();
          }
        },
        {
          text: 'Share via...',
          icon: 'share-social',
          handler: () => {
            this.nativeShare();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private copyToClipboard() {
    const recipeUrl = `${window.location.origin}/recipe-detail/${this.recipe?.idMeal}`;
    navigator.clipboard.writeText(recipeUrl).then(() => {
      this.showToast('Recipe link copied to clipboard');
    });
  }

  private nativeShare() {
    if (navigator.share) {
      navigator.share({
        title: this.recipe?.strMeal,
        text: `Check out this delicious recipe: ${this.recipe?.strMeal}`,
        url: `${window.location.origin}/recipe-detail/${this.recipe?.idMeal}`
      });
    } else {
      this.copyToClipboard();
    }
  }

  addToShoppingList() {
    if (!this.recipe) return;

    const shoppingList = this.getShoppingList();
    const newItems = this.ingredients.map(item => ({
      ingredient: item.ingredient,
      measure: item.measure,
      checked: false
    }));

    // Add only new items that aren't already in the list
    newItems.forEach(newItem => {
      const exists = shoppingList.some(item => 
        item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase()
      );
      if (!exists) {
        shoppingList.push(newItem);
      }
    });

    this.saveShoppingList(shoppingList);
    this.showToast('Ingredients added to shopping list');
  }

  openYouTubeVideo() {
    if (this.recipe?.strYoutube) {
      window.open(this.recipe.strYoutube, '_blank');
    }
  }

  searchByTag(tag: string) {
    this.router.navigate(['/home'], { queryParams: { search: tag } });
  }

  viewSimilarRecipe(recipeId: string) {
    this.router.navigate(['/recipe-detail', recipeId]);
  }

  printRecipe() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  // Format instructions with line breaks
  formatInstructions(instructions: string): string {
    if (!instructions) return 'No instructions available.';
    
    // Replace numbered steps with better formatting
    let formatted = instructions
      .replace(/\r\n|\r|\n/g, '<br>')
      .replace(/(\d+)\./g, '<strong>Step $1:</strong>');
    
    return formatted;
  }

  // Extract tags from recipe
  getTags(tagsString: string | null): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').slice(0, 6).map(tag => tag.trim());
  }

  // LocalStorage methods
  private getFavorites(): string[] {
    const favoritesStr = localStorage.getItem('recipe_favorites');
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  }

  private saveFavorites(favorites: string[]) {
    localStorage.setItem('recipe_favorites', JSON.stringify(favorites));
  }

  private getShoppingList(): any[] {
    const listStr = localStorage.getItem('recipe_shopping_list');
    return listStr ? JSON.parse(listStr) : [];
  }

  private saveShoppingList(list: any[]) {
    localStorage.setItem('recipe_shopping_list', JSON.stringify(list));
  }

  private async showToast(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK'],
      
    });
    await alert.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
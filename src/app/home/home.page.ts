import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons, 
  IonIcon, 
  IonItem, 
  IonInput, 
  IonSpinner, 
  
  IonChip,
  IonLabel,
  AlertController,
  ActionSheetController,
  Platform
} from '@ionic/angular/standalone';

import { Recipe } from '../models/recipe.model';
import { User } from '../models/user.model';
import { RecipeService } from '../services/recipe';
import { AuthService } from '../services/login';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonButtons, 
    IonIcon, 
    IonItem, 
    IonInput, 
    IonSpinner, 
    IonChip,
    IonLabel
  ]
})
export class HomePage implements OnInit {
  searchQuery: string = '';
  recipes: Recipe[] = [];
  isLoading: boolean = false;
  user: User | null = null;
  favorites: string[] = [];
  recentRecipes: Recipe[] = [];
  searchCount: number = 0;
  isDarkTheme: boolean = false;
  isGridView: boolean = true;
  currentTime: string = '';
  totalRecipes: number = 1000;
  userPhoto: string | null = null;

  // Quick categories with icons and colors
  quickCategories = [
    { name: 'Chicken', icon: 'nutrition', bgColor: 'bg-orange-500' },
    { name: 'Vegetarian', icon: 'leaf', bgColor: 'bg-green-500' },
    { name: 'Dessert', icon: 'ice-cream', bgColor: 'bg-pink-500' },
    { name: 'Pasta', icon: 'fast-food', bgColor: 'bg-blue-500' }
  ];

  // Search filters
  searchFilters = [
    { name: 'Quick', icon: 'flash', active: false },
    { name: 'Easy', icon: 'thumbs-up', active: false },
    { name: 'Healthy', icon: 'fitness', active: false },
    { name: 'Popular', icon: 'trending-up', active: false }
  ];

  // Cooking tips
  cookingTips = [
    'Always taste your food while cooking and adjust seasoning as needed!',
    'Let meat rest for a few minutes after cooking for juicier results.',
    'Use fresh herbs for the best flavor in your dishes.',
    'Don\'t overcrowd the pan when sautéing for better browning.',
    'Sharpen your knives regularly for easier and safer food preparation.',
    'Use the right oil for the right cooking temperature.',
    'Read the entire recipe before you start cooking.'
  ];
  currentTipIndex: number = 0;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private platform: Platform
  ) {}

  ngOnInit() {
    // Check if user is logged in
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/auth']);
      return;
    }

    // Load data from localStorage
    this.loadFavorites();
    this.loadRecentRecipes();
    this.loadSearchCount();
    this.loadThemePreference();
    this.loadUserPhoto();
    
    // Update current time
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 60000);

    // Apply dark mode on init
    this.applyTheme();
  }

  // Navigation methods
  goBack() {
    this.logout();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // Search functionality
  searchRecipes() {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.isLoading = true;
    this.recipes = [];
    this.incrementSearchCount();

    this.recipeService.searchRecipes(this.searchQuery).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.meals) {
          this.recipes = response.meals;
          this.addToRecentRecipes(response.meals[0]); // Add first result to recent
        } else {
          this.recipes = [];
          this.showAlert('No Results', `No recipes found for "${this.searchQuery}"`);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert('Error', 'Failed to fetch recipes. Please try again.');
        console.error('Search error:', error);
      }
    });
  }

  // Search by category
  searchRecipesByCategory(category: string) {
    this.searchQuery = category;
    this.searchRecipes();
  }

  viewRecipe(recipeId: string) {
    this.router.navigate(['/recipe-detail', recipeId]);
  }

  // Theme functionality
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }

  // View mode toggle
  toggleViewMode() {
    this.isGridView = !this.isGridView;
  }

  // Filter functionality
  toggleFilter(filter: any) {
    filter.active = !filter.active;
  }

  // Favorite functionality
  toggleFavorite(recipe: Recipe) {
    const index = this.favorites.indexOf(recipe.idMeal);
    
    if (index > -1) {
      // Remove from favorites
      this.favorites.splice(index, 1);
    } else {
      // Add to favorites
      this.favorites.push(recipe.idMeal);
    }
    
    // Save to localStorage
    this.saveFavorites();
  }

  isFavorite(recipeId: string): boolean {
    return this.favorites.includes(recipeId);
  }

  async showFavorites() {
    if (this.favorites.length === 0) {
      this.showAlert('Favorites', 'You haven\'t added any recipes to favorites yet.');
    } else {
      this.showAlert('Favorites', `You have ${this.favorites.length} favorite recipes.`);
    }
  }

  // Recent recipes functionality
  addToRecentRecipes(recipe: Recipe) {
    // Remove if already exists
    this.recentRecipes = this.recentRecipes.filter(r => r.idMeal !== recipe.idMeal);
    // Add to beginning
    this.recentRecipes.unshift(recipe);
    // Keep only last 5
    this.recentRecipes = this.recentRecipes.slice(0, 5);
    this.saveRecentRecipes();
  }

  clearRecent() {
    this.recentRecipes = [];
    this.saveRecentRecipes();
  }

  // Tips functionality
  getRandomTip(): string {
    return this.cookingTips[this.currentTipIndex];
  }

  nextTip() {
    this.currentTipIndex = (this.currentTipIndex + 1) % this.cookingTips.length;
  }

  // User Photo Upload Functionality
  async changeProfilePhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Change Profile Photo',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => {
            this.chooseFromGallery();
          }
        },
        {
          text: 'Remove Current Photo',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.removePhoto();
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

  takePhoto() {
    // In a real app, you would use Camera plugin
    // For demo, we'll simulate with file input
    this.simulateCamera();
  }

  chooseFromGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.processImage(file);
      }
    };
    input.click();
  }

  simulateCamera() {
    // For demo purposes, we'll use file input as camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // This simulates camera on mobile
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.processImage(file);
      }
    };
    input.click();
  }

  processImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userPhoto = e.target.result;
      this.saveUserPhoto();
      this.showAlert('Success', 'Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.userPhoto = null;
    this.saveUserPhoto();
    this.showAlert('Success', 'Profile photo removed successfully!');
  }

  // Utility methods
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    
    await alert.present();
  }

  clearSearch() {
    this.searchQuery = '';
    this.recipes = [];
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  // Extract tags from recipe
  getTags(tagsString: string | null): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').slice(0, 3).map(tag => tag.trim());
  }

  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // LocalStorage methods
  private loadFavorites() {
    const favoritesStr = localStorage.getItem('recipe_favorites');
    if (favoritesStr) {
      this.favorites = JSON.parse(favoritesStr);
    }
  }

  private saveFavorites() {
    localStorage.setItem('recipe_favorites', JSON.stringify(this.favorites));
  }

  private loadRecentRecipes() {
    const recentStr = localStorage.getItem('recipe_recent');
    if (recentStr) {
      this.recentRecipes = JSON.parse(recentStr);
    }
  }

  private saveRecentRecipes() {
    localStorage.setItem('recipe_recent', JSON.stringify(this.recentRecipes));
  }

  private loadSearchCount() {
    const countStr = localStorage.getItem('recipe_search_count');
    this.searchCount = countStr ? parseInt(countStr) : 0;
  }

  private incrementSearchCount() {
    this.searchCount++;
    localStorage.setItem('recipe_search_count', this.searchCount.toString());
  }

  private loadThemePreference() {
    const theme = localStorage.getItem('theme') || 'light';
    this.isDarkTheme = theme === 'dark';
  }

  private loadUserPhoto() {
    const photo = localStorage.getItem('user_photo');
    if (photo) {
      this.userPhoto = photo;
    }
  }

  private saveUserPhoto() {
    if (this.userPhoto) {
      localStorage.setItem('user_photo', this.userPhoto);
    } else {
      localStorage.removeItem('user_photo');
    }
  }
}
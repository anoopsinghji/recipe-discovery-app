# **Recipe Discovery Mobile App**

A modern, cross-platform mobile application for discovering and exploring recipes from around the world. Built with Ionic Angular and featuring a beautiful, responsive interface with dark mode support.

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TheMealDB API](https://img.shields.io/badge/TheMealDB_API-000000?style=for-the-badge)


## 📖 **About The Project**

Recipe Discovery is a feature-rich mobile application that brings the world of culinary arts to your fingertips. Whether you're a seasoned chef or a kitchen beginner, this app helps you discover, search, and explore thousands of recipes with beautiful visuals and detailed instructions.

### **Key Highlights**
- **Cross-Platform Compatibility** - Runs seamlessly on iOS and Android
- **Modern UI/UX** - Beautiful interface with dark mode support
- **Real-Time Search** - Instant recipe discovery powered by TheMealDB API
- **Secure Authentication** - Local storage-based user sessions
- **Responsive Design** - Optimized for all mobile devices

## ✨ **Features**

### 🔍 **Recipe Discovery**
- **Advanced Search** - Find recipes by name, ingredient, or category
- **Real-Time Results** - Instant search with live updates
- **Recipe Categories** - Browse by meal type, cuisine, and dietary preferences
- **Random Recipe** - Discover new dishes with the surprise feature

### 👤 **User Experience**
- **Secure Authentication** - Local storage-based login system
- **Form Validation** - Reactive forms with real-time validation
- **Favorite Recipes** - Save and organize your preferred recipes
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Offline Capabilities** - Basic functionality without internet connection

### 🎨 **UI/UX Design**
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Mobile-First Design** - Optimized for mobile devices
- **Smooth Animations** - Enhanced user interactions
- **Professional Layout** - Clean, modern, and intuitive interface
- **Cross-Platform** - Consistent experience on iOS and Android

## 🛠 **Technology Stack**

### **Frontend Framework**
- **Ionic Angular** - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript development
- **Angular Reactive Forms** - Robust form handling and validation
- **RxJS** - Reactive programming and state management

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Ionic Components** - Native-looking UI components
- **Custom Themes** - Dark/light mode implementation
- **Responsive Design** - Mobile-optimized layouts

### **API & Data**
- **TheMealDB API** - Comprehensive recipe database
- **HTTP Client** - API communication and data fetching
- **Local Storage** - User authentication and data persistence

### **Development Tools**
- **Ionic CLI** - Development and build tools
- **Git** - Version control
- **TypeScript** - Development environment

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- Ionic CLI (`npm install -g @ionic/cli`)
- Git
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/anoopsinghji/recipe-discovery-app.git

# Navigate to project directory
cd recipe-discovery-app

# Install dependencies
npm install

# Start development server
ionic serve

# The app will open in your browser at http://localhost:8100
```

### **Mobile Development**
```bash
# Add iOS platform
ionic capacitor add ios

# Add Android platform
ionic capacitor add android

# Build for production
ionic build

# Sync with native platforms
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

### **Environment Setup**
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  mealDBApi: 'https://www.themealdb.com/api/json/v1/1/'
};
```

## 🏃‍♂️ **Quick Start Guide**

1. **Launch the App**
   - Run `ionic serve` to start development
   - Use browser developer tools for mobile simulation

2. **User Registration**
   - Create a new account with email and password
   - Secure local storage authentication

3. **Explore Recipes**
   - Use search functionality to find specific recipes
   - Browse categories for meal inspiration
   - Save favorites for quick access

4. **Customize Experience**
   - Toggle between dark and light modes
   - Personalize your recipe preferences

## 📁 **Project Structure**

```
recipe-discovery-app/
│
├── src/
│   ├── app/
│   │   ├── auth/                    # Authentication module
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.guard.ts
│   │   ├── pages/                   # Main application pages
│   │   │   ├── home/               # Dashboard and main view
│   │   │   ├── search/             # Recipe search functionality
│   │   │   ├── categories/         # Recipe categories
│   │   │   ├── favorites/          # Saved recipes
│   │   │   └── recipe-detail/      # Individual recipe view
│   │   ├── services/               # Data and API services
│   │   │   ├── recipe.service.ts   # TheMealDB API integration
│   │   │   ├── auth.service.ts     # Authentication logic
│   │   │   └── storage.service.ts  # Local storage management
│   │   ├── models/                 # TypeScript interfaces
│   │   │   ├── recipe.interface.ts
│   │   │   └── user.interface.ts
│   │   ├── themes/                 # Dark/light mode theming
│   │   │   └── theme.service.ts
│   │   └── app.component.ts        # Root component
│   ├── assets/                     # Static resources
│   ├── environments/               # Environment configurations
│   └── global.scss                 # Global styles
│
├── ionic.config.json              # Ionic configuration
├── capacitor.config.ts           # Capacitor configuration
└── package.json                  # Dependencies and scripts
```

## 🔌 **API Integration**

### **TheMealDB API Endpoints Used**
```typescript
// Search recipes by name
`https://www.themealdb.com/api/json/v1/1/search.php?s={query}`

// Search by ingredient
`https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}`

// Get recipe by ID
`https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`

// List all categories
`https://www.themealdb.com/api/json/v1/1/categories.php`

// Filter by category
`https://www.themealdb.com/api/json/v1/1/filter.php?c={category}`

// Random recipe
`https://www.themealdb.com/api/json/v1/1/random.php`
```

### **Service Implementation**
```typescript
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient) {}
  
  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<{meals: Recipe[]}>(`${environment.mealDBApi}search.php?s=${query}`)
      .pipe(map(response => response.meals || []));
  }
}
```

## 🎨 **UI Components & Styling**

### **Tailwind CSS Integration**
- Custom configuration for Ionic compatibility
- Utility classes for rapid development
- Responsive design patterns
- Dark mode variant classes

### **Ionic Components Used**
- `ion-header` & `ion-toolbar` - Navigation headers
- `ion-content` - Scrollable content areas
- `ion-grid` & `ion-card` - Recipe listings
- `ion-searchbar` - Search functionality
- `ion-toggle` - Theme switching

## 🚀 **Building for Production**

### **Android Build**
```bash
# Build the web assets
ionic build

# Sync with Capacitor
npx cap sync

# Open Android Studio
npx cap open android

# In Android Studio: Build → Generate Signed Bundle / APK
```

### **iOS Build**
```bash
# Build the web assets
ionic build

# Sync with Capacitor
npx cap sync

# Open Xcode
npx cap open ios

# In Xcode: Product → Archive
```

### **Progressive Web App (PWA)**
```bash
# Build for PWA
ionic build --prod

# The app can be deployed to any web server
# Service workers and PWA features are included
```

## 🔧 **Development Features**

### **State Management**
- RxJS Observables for reactive data flow
- Services for shared state management
- Local storage persistence

### **Form Handling**
- Angular Reactive Forms for authentication
- Real-time validation feedback
- Custom validators for enhanced UX

### **Performance Optimizations**
- Lazy loading of modules
- Efficient API caching strategies
- Optimized images and assets

## 👨‍💻 **Developer**

**Anoop Singh**  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anoopsinghji)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anoopsinghji)

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 **Known Issues & Troubleshooting**

- **CORS Issues**: TheMealDB API may have CORS restrictions in browser
- **iOS Build**: Requires macOS with Xcode for iOS compilation
- **Android Emulator**: Ensure Android Studio and emulator are properly configured

---

**⭐ If you find this project helpful, please give it a star!**

---

### **Additional Notes for Deployment:**
- Update environment files for production API endpoints
- Configure app icons and splash screens for both platforms
- Set up proper app signing for store submissions
- Add privacy policy and app store descriptions
- Consider adding Firebase for enhanced authentication features

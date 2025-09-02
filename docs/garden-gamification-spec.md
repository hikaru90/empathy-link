# Garden Gamification Feature Specification

## Recent Implementation Changes

*This section documents the major changes made during development that differ from the original specification.*

### Major Architecture Changes (2024)

#### 1. Simplified Seed Economy
- **Original**: Multiple seed types (basic, rare, legendary, flower_seeds, tree_seeds, decoration_tokens)
- **Current**: Single "basic" seed currency for all purchases
- **Reason**: Simplified user experience and reduced complexity
- **Impact**: All items now cost basic seeds, easier to understand and manage

#### 2. Collection Schema Updates
- **Changed**: `plants_catalog` → `items` collection
- **Added**: `terraform` boolean column for plot modification items
- **Added**: `sprite` column for item display images
- **Reason**: More flexible system for different item types including terrain modification

#### 3. Inventory System Implementation
- **Added**: `user_items` collection for purchased item inventory
- **Added**: `/api/garden/inventory` endpoint to fetch user's items
- **Added**: `/api/garden/purchase` endpoint for buying items with seeds
- **Flow**: Purchase item → Add to inventory → Plant from inventory
- **Reason**: Separation of purchase and planting actions for better UX

#### 4. Terraform System
- **New Feature**: Items can modify plot terrain types
- **Dirt Block**: Raises build level, allows elevated planting
- **Water Block**: Creates water plots that prevent building
- **Implementation**: `terraform` flag in items determines terrain modification behavior

#### 5. Component Architecture
- **SeedInventory.svelte**: Now contains integrated shop drawer (simplified from separate shop)
- **IsometricGrid.svelte**: Displays items using PocketBase file API URLs
- **GardenView.svelte**: Handles real inventory system with plant/unplant functionality
- **Weather Effects**: Implemented with canvas-based sun rays and rain animations

#### 6. API Endpoints Implemented
```typescript
// Core garden functionality
GET  /api/garden/inventory     // Get user's item inventory
POST /api/garden/purchase      // Buy items with seeds  
POST /api/garden/plant         // Plant items from inventory
POST /api/garden/unplant       // Remove plants back to inventory

// Collection schemas
items: {
  name: string,
  category: string,
  seed_cost: number, 
  description: string,
  rarity: string,
  sprite?: string,        // Image file for display
  terraform: boolean      // Modifies plot terrain
}

user_items: {
  user: relation(users),
  item: relation(items),
  quantity: number,
  acquired_at: datetime
}
```

#### 7. PocketBase File Integration
- Sprite URLs: `${pb.baseUrl}/api/files/items/${itemId}/${filename}`
- Used across all garden components for consistent item display
- Supports both sprite images and emoji fallbacks

#### 8. User Experience Improvements
- **Purchase Flow**: Click seeds → Browse shop → Buy item → Item added to inventory
- **Planting Flow**: Click empty plot → Browse inventory → Select item → Plant item  
- **Terraform Flow**: Buy terraform items → Use like plants but modify plot type instead
- **No Alerts**: All error handling via console.log instead of disruptive alerts

---

## Overview

This document outlines the design and implementation requirements for a garden-based gamification system that encourages user engagement through chat completion rewards and social interaction.

## Feature Goals

- **Increase User Engagement**: Reward users for completing chats with tangible virtual rewards
- **Social Connection**: Enable users to visit and interact with friends' gardens
- **Emotional Reflection**: Use weather systems to visualize user mood states
- **Progressive Growth**: Provide long-term goals through plant cultivation

## Core Features

### 1. Garden System

#### 1.1 Garden Grid
- **Layout**: 9x9 isometric grid (81 total plots)
- **Location**: Available under `/community` route
- **Perspective**: Isometric view for depth and visual appeal
- **Plot Types**:
  - Soil plots (for planting)
  - Water features (decorative)
  - Path plots (for navigation)
  - Special feature plots (rocks, benches, etc.)

#### 1.2 Garden Ownership
- Each user receives one personal garden upon first visit to `/community`
- Garden state persists between sessions
- Initial garden starts as mostly empty soil plots

### 2. Currency & Reward System

#### 2.1 Seed Currency
- **Earning Method**: Users receive seeds when they complete a chat by clicking "Chat Abschließen" button
- **Seed Types**: Different seed types for different chat completion milestones
  - **Basic Seeds**: 1 seed per completed chat
  - **Bonus Seeds**: Additional seeds for longer conversations or specific achievements
  - **Special Seeds**: Rare seeds for completing certain chat types or milestones

#### 2.2 Seed Economy
- Seeds are stored in user's inventory
- Seeds can be spent in the shop to purchase plants and trees
- Different plants have different seed costs

### 3. Shop System

#### 3.1 Shop Interface
- Accessible from the garden view
- Categories:
  - **Flowers**: Low cost, quick growth, decorative
  - **Vegetables**: Medium cost, medium growth, practical
  - **Trees**: High cost, slow growth, permanent fixtures
  - **Decorations**: Various costs, instant placement, aesthetic

#### 3.2 Plant & Tree Catalog

**Flowers** (1-3 seeds):
- Roses (mood indicator plants)
- Sunflowers (positivity plants)
- Lavender (calm indicator plants)
- Daisies (basic decorative)

**Vegetables** (2-5 seeds):
- Tomatoes (nurturing indicator)
- Carrots (growth indicator)
- Herbs (wisdom indicator)

**Trees** (5-15 seeds):
- Oak trees (strength indicator)
- Willow trees (flexibility indicator)
- Fruit trees (abundance indicator)

**Decorations** (1-10 seeds):
- Garden paths
- Benches
- Water features
- Rocks and stones

### 4. Weather & Mood System

#### 4.1 Weather Types
Weather in the garden reflects the user's current emotional state based on recent chat analyses.

**Weather Conditions**:
- **Sunny**: High positive emotions, fulfilled needs
- **Partly Cloudy**: Mixed emotions, some unmet needs
- **Overcast**: Neutral or processing emotions
- **Rainy**: Sadness, grief, or emotional processing
- **Stormy**: High stress, anger, or intense emotions
- **Foggy**: Confusion, uncertainty, unclear feelings
- **Snowy**: Feeling isolated, need for warmth/connection

#### 4.2 Mood Analysis Algorithm
```typescript
interface MoodWeatherMapping {
  feelings: string[]; // Recent feelings from chat analysis
  needs: string[]; // Recent needs from chat analysis
  chatCount: number; // Recent chat activity
  lastChatDate: Date;
}

function calculateWeather(analysis: MoodWeatherMapping): WeatherType {
  // Algorithm based on:
  // - Dominant feelings in last 3 chats
  // - Fulfilled vs unfulfilled needs
  // - Chat frequency (active users get better weather)
  // - Specific feeling-weather mappings
}
```

#### 4.3 Weather Effects
- Weather affects plant growth rates
- Certain plants thrive in specific weather conditions
- Weather creates visual atmosphere in the garden
- Weather-appropriate ambient sounds

### 5. Social Features

#### 5.1 Friend System
- Users can add friends through existing social mechanisms
- Friend gardens are discoverable and visitable
- Privacy settings to control garden visibility

#### 5.2 Garden Visiting
- **Garden Discovery**: Browse friends' gardens
- **Weather Viewing**: See current weather in friends' gardens
- **Interaction**: Leave comments or reactions on friends' gardens
- **Inspiration**: Get ideas for own garden layout

#### 5.3 Social Features
- **Garden Sharing**: Screenshot and share garden layouts
- **Seasonal Events**: Community-wide gardening events
- **Leaderboards**: Most beautiful gardens, most active gardeners
- **Collaborative Features**: Future expansion for shared community gardens

## Technical Implementation

### 6. Visual Implementation Approach

#### 6.1 Recommended Implementation Strategy
**Primary: Svelte 5 Components with CSS Grid**
- **Isometric Grid**: Use CSS Grid with transforms for the 9x9 garden layout
- **Plant Components**: Individual Svelte components for each plant type with growth animations
- **Interactive Elements**: Native DOM events for clicking, hovering, and dragging
- **Responsive Design**: Easy to make mobile-friendly with CSS media queries
- **State Management**: Perfect integration with Svelte 5 runes for reactive garden state

**Secondary: Canvas for Weather Effects**
- **Weather Particles**: Rain, snow, leaves falling
- **Atmospheric Effects**: Fog, cloud shadows, sun rays
- **Performance**: Canvas excels at particle systems and weather animations

#### 6.2 Why This Approach is Best
1. **Performance**: CSS Grid + Svelte components are more performant than canvas for static elements
2. **Accessibility**: Native HTML elements are better for screen readers and keyboard navigation
3. **Maintainability**: Svelte 5 runes make state management clean and reactive
4. **Flexibility**: Easy to add new plant types, animations, and interactions
5. **Mobile**: Better touch support and responsive behavior than canvas

#### 6.3 Implementation Structure
```
src/lib/components/Garden/
├── GardenView.svelte          # Main container with CSS Grid
├── IsometricGrid.svelte       # 9x9 grid using CSS Grid + transforms
├── PlotComponent.svelte       # Individual plot with hover/click states
├── PlantRenderer.svelte       # Plant sprite with growth animations
├── WeatherCanvas.svelte       # Canvas overlay for weather effects
├── PlantShop.svelte          # Modal shop interface
└── SeedInventory.svelte      # Seed counter display
```

#### 6.4 Key Benefits for This Project
- **Svelte 5 Integration**: Perfect fit with existing tech stack
- **PocketBase Ready**: Easy to integrate with database collections
- **Real-time Updates**: Weather changes and plant growth can be reactive
- **Social Features**: Easy to implement friend garden browsing
- **Performance**: Efficient rendering for 81 plots with plants

### 7. PocketBase Collections

#### 7.1 Garden Collections Schema

**gardens** collection:
```javascript
// Collection: gardens
{
  id: "auto-generated",
  user: "relation(users)", // User who owns this garden
  name: "text", // Optional garden name
  grid_data: "json", // 9x9 grid state stored as JSON
  current_weather: "text", // Current weather type
  last_weather_update: "datetime",
  total_plants: "number", // Count of planted items
  garden_level: "number", // Garden experience level
  is_public: "bool", // Whether friends can visit
  created: "datetime",
  updated: "datetime"
}

// Example grid_data JSON structure:
{
  "plots": [
    {
      "x": 0, "y": 0,
      "type": "soil", // 'soil', 'water', 'path', 'decoration', 'dirt'
      "plant_id": "plant_rose_001",
      "planted_at": "2024-01-15T10:30:00Z", 
      "growth_stage": 2, // 0-4 (seed, sprout, young, mature, flowering)
      "last_watered": "2024-01-16T08:00:00Z",
      "build_level": 1 // NEW: 0=ground, 1=raised (dirt block), affects visual depth
    },
    {
      "x": 1, "y": 0,
      "type": "water", // Water plots cannot have plants
      "plant_id": null,
      "planted_at": null,
      "growth_stage": 0,
      "last_watered": null,
      "build_level": 0
    },
    // ... 79 more plots
  ]
}
```

**user_seeds** collection:
```javascript
// Collection: user_seeds
{
  id: "auto-generated",
  user: "relation(users)",
  seed_inventory: "json", // Seed counts by type
  total_seeds_earned: "number",
  created: "datetime",
  updated: "datetime"
}

// Example seed_inventory JSON:
{
  "basic": 15,
  "rare": 3,
  "legendary": 1,
  "flower_seeds": 8,
  "tree_seeds": 2,
  "decoration_tokens": 5
}
```

**items** collection:
```javascript
// Collection: items (renamed from plants_catalog)
{
  id: "auto-generated", // e.g., "plant_rose_001", "terraform_dirt_001"
  name: "text", // "Red Rose", "Dirt Block"
  category: "select(flower,vegetable,tree,decoration,terraform)",
  seed_cost: "number",
  growth_time_hours: "number", // Only relevant for plants
  weather_preference: "select(sunny,rainy,cloudy,stormy,any)", // Only relevant for plants
  rarity: "select(common,rare,legendary)",
  sprite: "file", // Item sprite image (renamed from sprite_image)
  description: "text",
  unlock_level: "number", // Garden level required
  is_active: "bool", // Available in shop
  terraform: "bool", // NEW: Whether this item modifies plot terrain
  terraform_type: "select(dirt,water,path,decoration)", // NEW: What terrain type it creates
  created: "datetime",
  updated: "datetime"
}

// Example terraform items:
{
  id: "terraform_dirt_001",
  name: "Dirt Block",
  category: "terraform", 
  seed_cost: 3,
  terraform: true,
  terraform_type: "dirt",
  description: "Raises the build level of a plot, allowing elevated planting",
  is_active: true
},
{
  id: "terraform_water_001", 
  name: "Water Block",
  category: "terraform",
  seed_cost: 5,
  terraform: true,
  terraform_type: "water", 
  description: "Creates a water feature that prevents building",
  is_active: true
}
```

**garden_weather_history** collection:
```javascript
// Collection: garden_weather_history
{
  id: "auto-generated",
  garden: "relation(gardens)",
  weather_type: "select(sunny,partly_cloudy,overcast,rainy,stormy,foggy,snowy)",
  mood_analysis: "json", // The chat analysis data used
  weather_duration_hours: "number",
  created: "datetime"
}

// Example mood_analysis JSON:
{
  "feelings": ["happy", "excited", "grateful"],
  "needs": ["connection", "celebration"],
  "chat_count": 3,
  "dominant_emotion": "positive",
  "stress_level": "low"
}
```

**garden_visits** collection:
```javascript
// Collection: garden_visits (for social features)
{
  id: "auto-generated",
  visitor: "relation(users)",
  garden: "relation(gardens)",
  visit_duration_seconds: "number",
  left_comment: "text", // Optional comment
  liked: "bool",
  created: "datetime"
}
```

**garden_achievements** collection:
```javascript
// Collection: garden_achievements
{
  id: "auto-generated",
  user: "relation(users)",
  achievement_type: "text", // "first_plant", "10_plants", "weather_master", etc.
  achievement_data: "json", // Additional data about the achievement
  reward_seeds: "number", // Bonus seeds awarded
  created: "datetime"
}
```

#### 7.2 PocketBase Integration Code

```typescript
// src/lib/server/garden.ts
import { pb } from '$scripts/pocketbase';

// Initialize user's garden when they first visit /community
export async function initializeUserGarden(userId: string) {
  try {
    // Check if garden already exists
    const existingGarden = await pb.collection('gardens').getFirstListItem(
      `user="${userId}"`
    ).catch(() => null);
    
    if (existingGarden) return existingGarden;

    // Create new garden with empty 9x9 grid
    const emptyGrid = {
      plots: Array.from({ length: 81 }, (_, i) => ({
        x: i % 9,
        y: Math.floor(i / 9),
        type: 'soil',
        plant_id: null,
        planted_at: null,
        growth_stage: 0,
        last_watered: null
      }))
    };

    const garden = await pb.collection('gardens').create({
      user: userId,
      name: '',
      grid_data: emptyGrid,
      current_weather: 'sunny',
      last_weather_update: new Date().toISOString(),
      total_plants: 0,
      garden_level: 1,
      is_public: true
    });

    // Initialize seed inventory
    await pb.collection('user_seeds').create({
      user: userId,
      seed_inventory: {
        basic: 3, // Starter seeds
        rare: 0,
        legendary: 0,
        flower_seeds: 2,
        tree_seeds: 0,
        decoration_tokens: 1
      },
      total_seeds_earned: 3
    });

    return garden;
  } catch (error) {
    console.error('Error initializing garden:', error);
    throw error;
  }
}

// Award seeds when user completes chat
export async function awardSeedsForChatCompletion(userId: string, chatData: any) {
  try {
    const seedsEarned = calculateSeedReward(chatData);
    
    // Get current seed inventory
    const userSeeds = await pb.collection('user_seeds').getFirstListItem(
      `user="${userId}"`
    );

    // Update inventory
    const updatedInventory = { ...userSeeds.seed_inventory };
    Object.keys(seedsEarned).forEach(seedType => {
      updatedInventory[seedType] = (updatedInventory[seedType] || 0) + seedsEarned[seedType];
    });

    await pb.collection('user_seeds').update(userSeeds.id, {
      seed_inventory: updatedInventory,
      total_seeds_earned: userSeeds.total_seeds_earned + Object.values(seedsEarned).reduce((a: number, b: number) => a + b, 0)
    });

    return seedsEarned;
  } catch (error) {
    console.error('Error awarding seeds:', error);
    throw error;
  }
}

function calculateSeedReward(chatData: any): Record<string, number> {
  const reward: Record<string, number> = { basic: 1 }; // Base reward
  
  // Bonus for longer chats
  if (chatData.messageCount > 10) reward.basic += 1;
  
  // Bonus for completing specific paths
  if (chatData.completedPath === 'feedback') reward.rare = 1;
  
  // Special seeds for milestones
  if (chatData.isFirstChat) reward.flower_seeds = 2;
  
  return reward;
}

// Update garden weather based on mood analysis
export async function updateGardenWeather(userId: string, moodAnalysis: any) {
  try {
    const garden = await pb.collection('gardens').getFirstListItem(
      `user="${userId}"`
    );

    const newWeather = calculateWeatherFromMood(moodAnalysis);
    
    await pb.collection('gardens').update(garden.id, {
      current_weather: newWeather,
      last_weather_update: new Date().toISOString()
    });

    // Save weather history
    await pb.collection('garden_weather_history').create({
      garden: garden.id,
      weather_type: newWeather,
      mood_analysis: moodAnalysis,
      weather_duration_hours: 24 // Default duration
    });

    return newWeather;
  } catch (error) {
    console.error('Error updating weather:', error);
    throw error;
  }
}

function calculateWeatherFromMood(analysis: any): string {
  const { feelings, needs, dominant_emotion, stress_level } = analysis;
  
  // High positive emotions
  if (dominant_emotion === 'positive' && stress_level === 'low') {
    return 'sunny';
  }
  
  // Mixed emotions
  if (stress_level === 'medium') {
    return 'partly_cloudy';
  }
  
  // Sadness or grief
  if (feelings.includes('sad') || feelings.includes('grief')) {
    return 'rainy';
  }
  
  // High stress or anger
  if (stress_level === 'high' || feelings.includes('angry')) {
    return 'stormy';
  }
  
  // Confusion or uncertainty
  if (feelings.includes('confused') || needs.includes('clarity')) {
    return 'foggy';
  }
  
  // Default
  return 'overcast';
}

// Plant something in the garden
export async function plantInGarden(userId: string, plotX: number, plotY: number, plantId: string) {
  try {
    const garden = await pb.collection('gardens').getFirstListItem(
      `user="${userId}"`
    );

    const plant = await pb.collection('plants_catalog').getOne(plantId);
    const userSeeds = await pb.collection('user_seeds').getFirstListItem(
      `user="${userId}"`
    );

    // Check if user has enough seeds
    const seedType = getSeedTypeForPlant(plant.category);
    if ((userSeeds.seed_inventory[seedType] || 0) < plant.seed_cost) {
      throw new Error('Insufficient seeds');
    }

    // Update grid data
    const gridData = garden.grid_data;
    const plotIndex = plotY * 9 + plotX;
    
    if (gridData.plots[plotIndex].plant_id) {
      throw new Error('Plot already occupied');
    }

    gridData.plots[plotIndex] = {
      ...gridData.plots[plotIndex],
      plant_id: plantId,
      planted_at: new Date().toISOString(),
      growth_stage: 0
    };

    // Update garden
    await pb.collection('gardens').update(garden.id, {
      grid_data: gridData,
      total_plants: garden.total_plants + 1
    });

    // Deduct seeds
    const updatedInventory = { ...userSeeds.seed_inventory };
    updatedInventory[seedType] -= plant.seed_cost;
    
    await pb.collection('user_seeds').update(userSeeds.id, {
      seed_inventory: updatedInventory
    });

    return gridData.plots[plotIndex];
  } catch (error) {
    console.error('Error planting:', error);
    throw error;
  }
}

function getSeedTypeForPlant(category: string): string {
  switch (category) {
    case 'flower': return 'flower_seeds';
    case 'tree': return 'tree_seeds';
    case 'decoration': return 'decoration_tokens';
    default: return 'basic';
  }
}
```

### 8. Frontend Components

#### 8.1 Garden View Component
```svelte
<!-- /src/lib/components/Garden/GardenView.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import IsometricGrid from './IsometricGrid.svelte';
  import WeatherOverlay from './WeatherOverlay.svelte';
  import PlantShop from './PlantShop.svelte';
  
  export let gardenData: Garden;
  export let currentWeather: WeatherType;
</script>
```

#### 8.2 Component Structure
```
src/lib/components/Garden/
├── GardenView.svelte          # Main garden container
├── IsometricGrid.svelte       # 9x9 isometric grid renderer
├── PlotComponent.svelte       # Individual garden plot
├── PlantRenderer.svelte       # Plant/tree visual component
├── WeatherOverlay.svelte      # Weather effects and animations
├── PlantShop.svelte          # Shop interface modal
├── SeedInventory.svelte      # User seed inventory display
├── FriendGardens.svelte      # Friend garden browser
└── GardenStats.svelte        # Garden statistics display
```

### 9. API Endpoints (SvelteKit Server Routes)

#### 9.1 Garden Management Routes
```typescript
// src/routes/api/garden/+server.ts - GET user's garden
export async function GET({ locals }) {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const garden = await initializeUserGarden(user.id);
  return json(garden);
}

// src/routes/api/garden/plant/+server.ts - Plant something
export async function POST({ request, locals }) {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const { plotX, plotY, plantId } = await request.json();
  const result = await plantInGarden(user.id, plotX, plotY, plantId);
  return json(result);
}

// src/routes/api/garden/weather/+server.ts - Get weather
export async function GET({ locals }) {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const garden = await pb.collection('gardens').getFirstListItem(`user="${user.id}"`);
  return json({ weather: garden.current_weather, lastUpdate: garden.last_weather_update });
}

// src/routes/api/garden/friends/+server.ts - Get friend gardens
export async function GET({ locals }) {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  // Get user's friends (assuming friends system exists)
  const friends = await pb.collection('user_relations').getFullList({
    filter: `user="${user.id}" && status="friend"`,
    expand: 'friend.garden'
  });
  
  return json(friends.map(f => f.expand.friend.garden));
}

// src/routes/api/garden/shop/+server.ts - Get shop items
export async function GET({ url }) {
  const category = url.searchParams.get('category') || '';
  const filter = category ? `category="${category}" && is_active=true` : 'is_active=true';
  
  const plants = await pb.collection('plants_catalog').getFullList({
    filter,
    sort: 'seed_cost,name'
  });
  
  return json(plants);
}
```

#### 9.2 Seed & Reward System Routes
```typescript
// src/routes/api/seeds/+server.ts - Get user inventory
export async function GET({ locals }) {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const seeds = await pb.collection('user_seeds').getFirstListItem(`user="${user.id}"`);
  return json(seeds);
}

// src/routes/api/seeds/spend/+server.ts - Purchase plants
export async function POST({ request, locals }) {
  const user = locals.user;
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  const { plantId, quantity = 1 } = await request.json();
  // Implementation would handle spending seeds for plants
  return json({ success: true });
}

// Integration with existing chat completion
// src/routes/api/ai/bullshift/feedback/+server.ts - Modified to award seeds
export async function POST({ request, locals }) {
  // ... existing chat completion logic ...
  
  // Award seeds after successful chat completion
  if (chatCompleted) {
    const seedsEarned = await awardSeedsForChatCompletion(user.id, {
      messageCount: chatHistory.length,
      completedPath: currentPath,
      isFirstChat: isFirstChat
    });
    
    // Also update garden weather based on chat analysis
    const moodAnalysis = extractMoodFromChat(chatHistory);
    await updateGardenWeather(user.id, moodAnalysis);
  }
  
  return json({ success: true, seedsEarned });
}
```

### 10. Visual Design

#### 10.1 Isometric Grid System
- **Grid Size**: 9x9 plots
- **Plot Dimensions**: Consistent square plots in isometric perspective
- **Visual Depth**: Layered rendering for trees, plants, decorations
- **Interactive Elements**: Hover states, click handlers for plot management

#### 10.2 Weather Visual Effects
- **Particle Systems**: Rain drops, snowflakes, falling leaves
- **Lighting Changes**: Different ambient lighting per weather type
- **Atmospheric Effects**: Fog overlays, cloud shadows, sun rays
- **Sound Design**: Weather-appropriate ambient sounds

#### 10.3 Plant Growth Animation
- **Growth Stages**: Seed → Sprout → Young → Mature → Flowering
- **Animation Timing**: Smooth transitions between growth stages
- **Seasonal Changes**: Plants adapt appearance based on weather
- **Interactive Feedback**: Visual feedback when plants are watered/tended

### 11. Future Expansion Ideas

#### 11.1 Advanced Features
- **Seasonal Events**: Special plants available during certain times
- **Garden Contests**: Community competitions for best gardens
- **Cross-Pollination**: Breeding plants to create new varieties
- **Garden Tools**: Watering cans, fertilizer, pest control
- **Achievement System**: Badges for gardening milestones

#### 11.2 Integration Opportunities
- **Chat Analysis Integration**: More sophisticated mood-weather mapping
- **Learning Module Rewards**: Special seeds for completing learning modules
- **Community Challenges**: Group goals that affect everyone's garden weather
- **Export Features**: Share garden images on social media

## Implementation Timeline

### Phase 1: PocketBase Setup & Core Garden (2-3 weeks)

**PocketBase Collections Setup:**
1. Create all 6 collections in PocketBase admin:
   - `gardens` 
   - `user_seeds`
   - `plants_catalog`
   - `garden_weather_history`
   - `garden_visits`
   - `garden_achievements`

2. **Populate Initial Data:**
```javascript
// Sample plants_catalog data to insert
const initialPlants = [
  {
    id: "plant_rose_001",
    name: "Red Rose",
    category: "flower",
    seed_cost: 2,
    growth_time_hours: 24,
    weather_preference: "sunny",
    rarity: "common",
    description: "A beautiful red rose that blooms in sunny weather",
    unlock_level: 1,
    is_active: true
  },
  {
    id: "plant_oak_001", 
    name: "Oak Tree",
    category: "tree",
    seed_cost: 8,
    growth_time_hours: 72,
    weather_preference: "any",
    rarity: "rare",
    description: "A mighty oak tree that provides shade and strength",
    unlock_level: 3,
    is_active: true
  }
  // ... more plants
];
```

3. **Core Development Tasks:**
   - Create `/community` route and page
   - Implement `initializeUserGarden()` function
   - Basic 9x9 isometric grid display
   - Simple plant placement functionality
   - Integration with chat completion for seed rewards

### Phase 2: Weather & Mood Integration (1-2 weeks)

**PocketBase Integration:**
- Implement weather calculation from existing chat analysis
- Create weather history tracking
- Mood analysis data structure in PocketBase

**Development Tasks:**
- `updateGardenWeather()` function
- Weather visual effects overlay
- Integration with existing chat analysis pipeline
- Weather impact on plant growth rates

### Phase 3: Social Features (2-3 weeks)

**PocketBase Collections:**
- Friend system integration (may need `user_relations` collection)
- Garden visiting and interaction tracking
- Privacy settings for gardens

**Development Tasks:**
- Friend garden browser
- Garden sharing functionality
- Visit logging and statistics
- Social interactions (likes, comments)

### Phase 4: Polish & Advanced Features (2-3 weeks)

**PocketBase Enhancements:**
- Achievement system implementation
- Advanced plant catalog with images
- Garden statistics and analytics

**Development Tasks:**
- Plant growth animations
- Weather particle effects and sounds
- Achievement notifications
- Performance optimization
- Mobile responsiveness

## PocketBase Collection Setup Guide

### Step-by-Step Collection Creation:

1. **Access PocketBase Admin** (usually at `http://localhost:8090/_/`)

2. **Create Collections** with these exact schemas:

```bash
# gardens collection
- user: relation(users) [required]
- name: text
- grid_data: json [required]
- current_weather: text [required, default: "sunny"]
- last_weather_update: datetime [required]
- total_plants: number [default: 0]
- garden_level: number [default: 1]
- is_public: bool [default: true]

# user_seeds collection  
- user: relation(users) [required, unique]
- seed_inventory: json [required]
- total_seeds_earned: number [default: 0]

# plants_catalog collection
- name: text [required]
- category: select(flower,vegetable,tree,decoration) [required]
- seed_cost: number [required, min: 1]
- growth_time_hours: number [required, min: 1]
- weather_preference: select(sunny,rainy,cloudy,stormy,any) [default: "any"]
- rarity: select(common,rare,legendary) [default: "common"]
- sprite_image: file [optional]
- description: text
- unlock_level: number [default: 1, min: 1]
- is_active: bool [default: true]

# garden_weather_history collection
- garden: relation(gardens) [required]
- weather_type: select(sunny,partly_cloudy,overcast,rainy,stormy,foggy,snowy) [required]
- mood_analysis: json
- weather_duration_hours: number [default: 24]

# garden_visits collection
- visitor: relation(users) [required]
- garden: relation(gardens) [required]
- visit_duration_seconds: number
- left_comment: text
- liked: bool [default: false]

# garden_achievements collection
- user: relation(users) [required]
- achievement_type: text [required]
- achievement_data: json
- reward_seeds: number [default: 0]
```

3. **Set Collection Rules:**
   - `gardens`: Users can only read/write their own gardens
   - `user_seeds`: Users can only read/write their own seed inventory
   - `plants_catalog`: Public read, admin write
   - `garden_weather_history`: Auto-generated, users can read their own
   - `garden_visits`: Users can create visits, read their own
   - `garden_achievements`: Auto-generated, users can read their own

## Success Metrics

- **User Engagement**: Increase in chat completions after garden launch
- **Session Duration**: Time spent in garden section
- **Social Interaction**: Friend garden visits and interactions
- **Retention**: Users returning to tend their gardens
- **Progression**: Users purchasing and planting new items

## Conclusion

The garden gamification feature will provide users with a meaningful, visual representation of their emotional journey while encouraging continued engagement with the chat system. The combination of personal expression, social interaction, and mood reflection creates a holistic experience that supports the app's core mission of emotional well-being and communication.
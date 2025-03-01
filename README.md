
# Cinematic Saga Search

A beautiful, responsive movie listing website that leverages the OMDB API to search and display movie information.

## Project info

**URL**: https://lovable.dev/projects/8bbda86b-7860-4168-bf51-3198457d8daf

## Features

- **Search Functionality**: Search for movies with a debounced search input to minimize API calls
- **Typeahead Suggestions**: Get real-time movie suggestions as you type
- **Infinite Loading**: Load more movies as you scroll through the results
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Movie Details**: View comprehensive information about each movie
- **Favorites System**: Save your favorite movies for easy access
- **Recent Searches**: Keeps track of your recent searches
- **Smooth Animations**: Elegant transitions and loading states

## Technologies Used

- **React**: UI library for building the interface
- **React Router**: For navigation between pages
- **React Query**: For data fetching and caching
- **Tailwind CSS**: For styling the application
- **Lucide React**: For icons

## API Integration

This project uses the OMDB API (Open Movie Database) to fetch movie data:
- API Key: b9bd48a6
- Example: https://www.omdbapi.com/?apikey=b9bd48a6&s=marvel

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser and navigate to http://localhost:8080

## Project Structure

The project is organized into the following directories:

- `/src/components`: Reusable UI components
- `/src/pages`: Page components for different routes
- `/src/hooks`: Custom React hooks
- `/src/context`: React context for global state management

## Performance Optimizations

- Debounced search input to reduce API calls
- React.memo for component memoization
- Optimized loading states and error handling
- Image lazy loading with fallbacks

## Editing the Code

There are several ways to edit this application:

**Use Lovable**

Visit the [Lovable Project](https://lovable.dev/projects/8bbda86b-7860-4168-bf51-3198457d8daf) and start prompting.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Follow these steps:

```sh
# Step 1: Clone the repository 
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

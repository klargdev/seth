# Memorial Website

A React-based memorial website application with Supabase backend. This application allows family and friends to share memories, tributes, and make donations in memory of their loved one.

## Features

- Share memories with optional images
- Post tributes and condolences
- Make donations with various payment methods
- View event program schedule
- Interactive map with directions to event locations
- Photo/video gallery
- Customizable theme
- Mobile-responsive design

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- Google Maps API key (for location features)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd memorial-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project at https://supabase.com

4. Create a `.env` file in the project root with the following variables:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

5. Set up the database schema by running the SQL commands in `supabase/schema.sql`

6. Start the development server:
```bash
npm start
```

## Database Setup

1. Navigate to your Supabase project's SQL editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL commands to create all required tables and security policies

## Environment Variables

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_KEY`: Your Supabase project's anon/public key
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key for location features

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy using the Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify project settings
3. Deploy using the Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy
```

## Project Structure

```
src/
  ├── components/         # React components
  ├── pages/             # Page components
  ├── services/          # API services
  ├── styles/            # CSS styles
  └── App.js            # Root component
```

## Components Documentation

### DonationForm
- Collects and processes donations
- Validates form inputs
- Handles multiple payment methods
- Stores donation information in Supabase

### TributeList
- Displays tributes with infinite scroll
- Supports sorting by date
- Shows images if provided
- Responsive grid layout

### MemoryPostForm
- Allows users to share memories
- Supports image uploads
- Includes preview functionality
- Character limit counter

### ProgramOutline
- Displays event schedule
- Groups events by day
- Provides printable version
- Shows event details including location

### MapDirections
- Interactive Google Maps integration
- Shows all event locations
- Provides directions from user's location
- Displays travel time and distance

## API Endpoints

### Supabase Tables

#### memories
- `id`: UUID (primary key)
- `created_at`: timestamp
- `author_name`: text
- `content`: text
- `image_url`: text (optional)

#### tributes
- `id`: UUID (primary key)
- `created_at`: timestamp
- `author_name`: text
- `content`: text
- `image_url`: text (optional)

#### donations
- `id`: UUID (primary key)
- `created_at`: timestamp
- `donor_name`: text
- `email`: text (optional)
- `amount`: numeric
- `payment_method`: text
- `message`: text (optional)

#### program_schedule
- `id`: UUID (primary key)
- `created_at`: timestamp
- `event_date`: timestamp
- `title`: text
- `description`: text
- `location`: text
- `location_coords`: point

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

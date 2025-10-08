# Git Submodule Integration Setup

This project uses Git submodules to integrate the `paperworkpro` backend repository with the `paperworkpro_front` frontend repository.

## Current Status

The integration is set up with mock files. To connect to your actual `paperworkpro` repository, follow these steps:

## Step 1: Remove Mock Backend

```bash
# Remove the mock backend directory
rm -rf backend/
```

## Step 2: Add Your Actual Repository as Submodule

```bash
# Replace with your actual repository URL
git submodule add https://github.com/YOUR_USERNAME/paperworkpro.git backend

# Initialize and update the submodule
git submodule update --init --recursive
```

## Step 3: Update the API Bridge

Once you have the actual repository, update the API bridge file:

```typescript
// src/lib/paperwork-api.ts
import { PaperworkAPI } from '../backend/src/api/PaperworkAPI'; // Update this import path
```

## Step 4: Update Package Dependencies

If your backend has specific dependencies, you may need to install them:

```bash
# Install backend dependencies
cd backend
npm install

# Return to root
cd ..
```

## Step 5: Commit the Submodule

```bash
git add backend
git commit -m "Add paperworkpro backend as submodule"
git push
```

## Working with Submodules

### Updating the Backend

```bash
# Update to latest version
git submodule update --remote backend

# Commit the update
git add backend
git commit -m "Update backend submodule"
```

### Cloning the Project

When someone clones this repository, they need to initialize submodules:

```bash
git clone https://github.com/YOUR_USERNAME/paperworkpro_front.git
cd paperworkpro_front
git submodule update --init --recursive
```

## File Structure

```
paperworkpro_front/
├── src/
│   ├── lib/
│   │   └── paperwork-api.ts          # API bridge
│   └── app/
│       └── api/
│           └── paperwork/            # API routes
├── backend/                          # Submodule (paperworkpro)
│   ├── src/
│   │   └── api/
│   │       └── PaperworkAPI.ts      # Backend API
│   └── package.json
└── package.json
```

## API Integration

The frontend communicates with the backend through:

1. **API Bridge** (`src/lib/paperwork-api.ts`) - Provides a clean interface
2. **API Routes** (`src/app/api/paperwork/`) - Next.js API routes that call the backend
3. **Components** - Use the API bridge to create/manage paperwork

## Testing the Integration

1. Start the development server: `npm run dev`
2. Click the "Create Paperwork" button
3. Fill out the form and submit
4. Check the browser console for success/error messages

## Troubleshooting

### Submodule Not Found
- Ensure the repository URL is correct
- Check that you have access to the repository
- Verify the repository exists and is public (or you have access)

### Import Errors
- Check that the backend has the expected file structure
- Verify the import paths in `paperwork-api.ts`
- Ensure the backend exports the expected classes/functions

### API Errors
- Check that the backend API endpoints match the expected format
- Verify the API routes are correctly configured
- Check the browser network tab for detailed error information

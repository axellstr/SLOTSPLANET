# Casino Website & CMS

A clean Next.js project with casino website and admin dashboard functionality.

## Project Structure

- **Main Website**: Simple homepage at `/` with casino data from CMS
- **Admin Dashboard**: Full-featured CMS at `/admin` with drag & drop casino management
- **API**: RESTful endpoints at `/api/casinos` for data management

## What's Included

### Admin Dashboard (/admin)
✅ **Working perfectly** - Complete CMS functionality:
- Statistics dashboard 
- Add/edit/delete casinos
- Drag & drop reordering
- Export/import data
- Real-time updates

### Main Website (/)
🧹 **Cleaned up** - Ready for rebuilding:
- Minimal structure with casino data fetching
- Clean foundation for new UI development
- No dependencies on external CSS frameworks

## Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **React Beautiful DnD** - Drag & drop functionality
- **Lucide React** - Icons for admin dashboard
- **File-based storage** - JSON data persistence

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## File Structure

```
├── pages/
│   ├── index.tsx           # Main website (minimal)
│   ├── admin/
│   │   └── index.tsx       # Admin dashboard
│   └── api/
│       └── casinos.js      # API endpoints
├── components/
│   └── CasinoForm.tsx      # Casino editing form
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   └── casinoData.ts      # Data utilities
├── public/
│   ├── Assets/            # Images and assets
│   └── styles/
│       └── admin.css      # Admin dashboard styles
├── styles/
│   ├── globals.css        # Global styles
│   └── styles.css         # Original casino styles
└── data/
    └── casinos.json       # Casino data storage
```

## Next Steps

The project is now clean and ready for you to rebuild the main website UI however you'd like:

1. **Admin works perfectly** - No changes needed
2. **Main site is minimal** - Ready for your custom UI
3. **Data integration ready** - Casino data flows from CMS to website
4. **No framework dependencies** - Use any CSS approach you prefer

Start building your casino website UI in `pages/index.tsx`! 
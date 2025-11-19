# LLMCostGuide

A modern web application that helps product managers, developers, and analysts understand and compare LLM model pricing across different providers like OpenRouter and TogetherAI.

## 🚀 Features

- **Multi-Provider Support**: Compare pricing across OpenRouter and TogetherAI
- **Real-time Search**: Instant filtering by model name and provider
- **Smart Sorting**: Sortable table columns for easy comparison
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful loading states and transitions
- **Provider Filtering**: Easy switching between providers

## 🛠 Tech Stack

- **Frontend**: React with Vite
- **UI Framework**: Material UI (MUI)
- **Database**: Supabase
- **Styling**: CSS Modules with MUI theming
- **Data Management**: React Query
- **CSV Processing**: Papa Parse

## 📋 Requirements

- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd llmcostguide
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application
VITE_APP_NAME=LLMCostGuide
VITE_APP_VERSION=1.0.0
```

### 3. Database Setup

1. Create a new project in your Supabase dashboard
2. Run the database schema from `LLMCostGuide_Technical_Specification.md`
3. Configure any necessary RLS policies

### 4. Start Development

```bash
npm run dev
```

The app will start on `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   ├── providers/      # Provider-specific components
│   ├── pricing/        # Pricing-related components
│   └── admin/          # Admin components
├── hooks/              # Custom hooks
├── services/           # API and business logic
├── utils/              # Utility functions
├── styles/             # Global styles and themes
└── assets/             # Static assets
```

## 📊 Database Schema

The application uses Supabase as the backend with the following main table:

### `llm_models` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `model_name` | VARCHAR(255) | Model name |
| `provider` | VARCHAR(100) | Provider name |
| `context_limit` | INTEGER | Context window size |
| `input_price_per_1M_tokens` | DECIMAL | Input token price |
| `output_price_per_1M_tokens` | DECIMAL | Output token price |
| `caching_price_per_1M_tokens` | DECIMAL | Caching token price |
| `model_type` | VARCHAR(50) | Text/Images/Videos/Embeddings |
| `added_on` | TIMESTAMP | Creation date |
| `context_window` | VARCHAR(50) | Human-readable context size |
| `description` | TEXT | Model description |
| `is_active` | BOOLEAN | Active status |

## 🎨 UI Components

### Main Features

1. **Provider Selector**: Dropdown to filter by provider
2. **Search Bar**: Real-time search across model names and providers
3. **Pricing Table**: Comprehensive table with all pricing information
4. **Sorting**: Click column headers to sort data
5. **Loading States**: Smooth skeleton animations
6. **Responsive Design**: Mobile-friendly card layout

### Table Columns

- **Model Name**: Clickable model identifier
- **Provider**: Provider badge and name
- **Context**: Context window size (e.g., "8K", "32K")
- **Input Price**: Cost per 1K input tokens
- **Output Price**: Cost per 1K output tokens
- **Caching Price**: Cost per 1K cached tokens
- **Type**: Model type (Text/Images/Videos/Embeddings)
- **Added On**: Date model was added to database

## 📈 Data Management

### Manual CSV Import

The application supports manual CSV import for updating model data:

```csv
model_name,provider,context_limit,input_price,output_price,caching_price,model_type,context_window,description
gpt-4,OpenRouter,8192,0.03,0.06,0.015,Text,8K,OpenAI GPT-4 model
llama-2-70b,TogetherAI,4096,0.0009,0.0009,0,Text,4K,Meta LLaMA 2 70B
```

### Supported Providers

- **OpenRouter**: https://openrouter.ai/models
- **TogetherAI**: https://www.together.ai/pricing

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (when configured)
npm run lint

# Format code (when configured)
npm run format
```

### Component Development

When creating new components:

1. Follow the naming convention: `ComponentName/ComponentName.jsx`
2. Use CSS Modules for styling: `ComponentName.module.css`
3. Add proper TypeScript interfaces
4. Include loading and error states
5. Ensure responsive design
6. Add accessibility attributes

### Testing

The project uses React Testing Library for component testing:

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Vercel

1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Netlify

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🔒 Security

- Supabase Row Level Security (RLS) policies
- Input validation for all user inputs
- CSV file validation and sanitization
- CORS configuration for API endpoints

## 📱 Browser Support

- Chrome (v80+)
- Firefox (v75+)
- Safari (v13+)
- Edge (v80+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Material UI](https://mui.com) for the component library
- [OpenRouter](https://openrouter.ai) and [TogetherAI](https://together.ai) for providing pricing data

## 📞 Support

If you have any questions or suggestions, please open an issue in the [repository](<repository-url>).

---

**LLMCostGuide** - Making LLM pricing transparent and accessible for everyone.
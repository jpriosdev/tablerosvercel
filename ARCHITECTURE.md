# QA Dashboard - Architecture & Development Guide

## 🏗️ System Architecture

### Backend Data Layer

```
API Request (pages/api/qa-data.js)
    ↓
qaDataLoader.getQAData()
    ├─ Check in-memory cache (5 min TTL)
    ├─ Try JSON (public/data/qa-data.json)
    ├─ Fallback to Excel (data/Reporte_QA_V1.xlsx)
    └─ Final fallback: Built-in seed data
    ↓
Cached & returned to client
```

**Key Benefits:**
- **Resilience**: Multiple data sources with graceful degradation
- **Performance**: 5-minute in-memory cache eliminates repeated file I/O
- **Maintainability**: Single loader module centralizes all data loading logic
- **Testability**: Isolated, pure function with predictable inputs/outputs

### Frontend Components

```
ExecutiveDashboard (pages/index.js)
├─ RiskMatrix
│   └─ Displays bugs by priority with visual hierarchy
├─ SprintTrendChart
│   └─ Multi-axis line chart showing trends over sprints
├─ ModuleAnalysis
│   └─ Bug distribution across system modules
├─ QualityMetrics
│   └─ Key quality indicators (automation %, cycle time, etc.)
└─ ExecutiveRecommendations
    └─ Data-driven action items
```

## 💾 Data Loading

### qaDataLoader.js

Located: `lib/qaDataLoader.js`

**Exports:**
```javascript
export async function getQAData({ forceReload = false } = {})
```

**Behavior:**
1. Returns cached data if available and not stale (< 5 min)
2. Attempts to load from JSON file
3. Falls back to Excel file processing
4. Returns built-in seed data if all sources fail
5. Always caches result for future requests

**Usage:**
```javascript
import { getQAData } from '../lib/qaDataLoader.js';

// In API route
const qaData = await getQAData();
res.json(qaData);

// Force cache refresh
const freshData = await getQAData({ forceReload: true });
```

### Data Source Priorities

1. **In-Memory Cache** (0-5 min old)
2. **JSON File** (`public/data/qa-data.json`)
3. **Excel File** (`data/Reporte_QA_V1.xlsx`)
4. **Seed Data** (embedded fallback)

## 🎨 Frontend Components

### RiskMatrix.js

Displays QA bug metrics organized by priority level.

**Props:**
```javascript
{
  data: {
    'Más alta': { count: 7, pending: 2, resolved: 5 },
    'Alta': { count: 41, pending: 23, resolved: 18 },
    'Media': { count: 82, pending: 38, resolved: 44 },
    'Baja': { count: 8, pending: 7, resolved: 1 }
  }
}
```

**Features:**
- Color-coded by priority (red → green)
- Shows pending vs resolved counts
- Calculates percentages automatically
- Responsive layout (text size adjusts for mobile)
- ARIA labels for accessibility

### SprintTrendChart.js

Multi-axis line chart showing sprint trends.

**Props:**
```javascript
{
  data: [
    {
      sprint: 'Sprint 16',
      bugs: 46,
      bugsResolved: 25,
      bugsPending: 13,
      testCases: 135,
      velocity: 19,
      change: 0
    },
    // ... more sprints
  ]
}
```

**Features:**
- Dual Y-axes (bugs left, test cases right)
- Smooth tension curves (0.4)
- Enhanced hover tooltips
- Accessible region role
- Consistent color scheme via constants

## 🔧 Code Optimization

### Current Optimizations
- ✅ Constants extracted (`COLORS` in SprintTrendChart)
- ✅ JSDoc comments added to complex functions
- ✅ Responsive utilities integrated
- ✅ Accessibility labels (aria-label, role)

### Recommended Future Improvements
- Consider React.memo() for chart components if they re-render often
- Pre-compute percentages in loader vs. component
- Lazy-load chart libraries only when component mounts
- Add error boundary around chart components

## 📝 Code Style

### Comments
- JSDoc blocks for exported functions
- Inline comments for complex logic (> 3 lines)
- Avoid obvious comments ("// increment x")

### Naming
- camelCase for functions/variables
- UPPER_CASE for constants
- Descriptive names (avoid `x`, `temp`, `data`)

### Structure
- Group related logic together
- Extract repeated patterns into helpers
- Keep files under 300 lines (split if larger)

## 🧪 Testing

Future test areas (not yet implemented):
- `qaDataLoader`: Test cache TTL, all fallback paths
- Components: Snapshot tests, prop validation
- Integration: API → Loader → Component flow

## 📚 File Reference

```
TableroQA/
├─ lib/
│  ├─ qaDataLoader.js       ← Centralized data loading (NEW)
│  ├─ excelProcessor.cjs    ← Excel parsing
│  └─ analyzeFields.cjs     ← Data analysis utilities
├─ pages/
│  ├─ api/
│  │  └─ qa-data.js         ← API endpoint (refactored)
│  └─ index.js              ← Main dashboard
├─ components/
│  ├─ RiskMatrix.js         ← Priority bugs (enhanced)
│  ├─ SprintTrendChart.js   ← Trend visualization (enhanced)
│  ├─ ModuleAnalysis.js
│  ├─ QualityMetrics.js
│  └─ ExecutiveRecommendations.js
├─ public/data/
│  ├─ qa-data.json          ← Pre-processed QA data
│  └─ recommendations.json  ← Generated recommendations
├─ config/
│  └─ qa-config.json        ← App settings
└─ ARCHITECTURE.md          ← This file
```

## 🚀 Development Workflow

1. **Modify data loading**: Update `lib/qaDataLoader.js`
2. **Test in API**: Visit `/api/qa-data` to verify response
3. **Update component**: Modify rendering logic in `components/`
4. **Check accessibility**: Test with screen reader or ARIA inspector
5. **Performance**: Monitor Network tab (< 100ms JSON load)

## 📖 Documentation

- `README.md`: User-facing features and installation
- `ARCHITECTURE.md`: Developer-facing structure (this file)
- JSDoc blocks: In-code API reference
- Inline comments: Logic explanations

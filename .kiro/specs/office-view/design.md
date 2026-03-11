# Design Document: Office View

## Overview

The Office View is an ambient visualization feature that displays AI agents as pixel-art characters in an isometric office environment. Each agent sits at a desk with an animated monitor reflecting their current activity status. The view provides a live, visual representation of the agent team's state, integrating seamlessly with the existing Mission Control application architecture.

This feature is purely presentational - it reads from the existing Zustand state management system without introducing new data fetching mechanisms. The implementation follows Next.js App Router conventions, uses TypeScript for type safety, and maintains consistency with the existing codebase's styling patterns.

### Key Design Principles

1. **State Integration**: Read directly from the existing `useMissionControl` Zustand store
2. **Component Modularity**: Break down the view into reusable, testable components
3. **Styling Isolation**: Use a dedicated CSS file to avoid conflicts with global styles
4. **Performance**: Minimize re-renders through proper React optimization patterns
5. **Accessibility**: Ensure keyboard navigation and screen reader support where applicable

## Architecture

### Component Hierarchy

```
OfficeView (Page Component)
├── Windows Row (Decorative)
├── Checkerboard Floor (Background)
├── DeskStation[] (For each agent)
│   ├── PixelDesk
│   ├── PixelMonitor
│   │   └── ScreenContent (Animation)
│   ├── PixelAvatar (Canvas)
│   ├── StatusDot
│   ├── SpeechBubble (Hover)
│   └── NameTag (Hover)
└── GhostDesk[] (Empty desks)
```

### Routing Integration

The Office View will be integrated into the existing Next.js App Router structure:

- **Route**: `/workspace/[slug]/office`
- **File Location**: `src/app/workspace/[slug]/office/page.tsx`
- **Navigation**: Add entry to sidebar navigation (handled by AgentsSidebar or similar navigation component)

### State Management Integration

The Office View will consume state from the existing Zustand store (`useMissionControl`):

```typescript
const { agents } = useMissionControl();
```

**Agent Properties Used**:
- `id`: Unique identifier
- `name`: Display name
- `status`: AgentStatus ('standby' | 'working' | 'offline')
- `avatar_emoji`: Emoji character for visual representation
- Current task (derived from tasks array where `assigned_agent_id` matches agent id and status is 'in_progress')

**State Reactivity**: The component will automatically re-render when the agents array or tasks array changes, thanks to Zustand's built-in reactivity.

## Components and Interfaces

### 1. OfficeView (Page Component)

**Location**: `src/app/workspace/[slug]/office/page.tsx`

**Responsibilities**:
- Fetch workspace context from URL params
- Read agent data from Zustand store
- Derive current tasks for each agent
- Render the office environment layout
- Position desk stations and ghost desks

**Props**: None (uses URL params and Zustand store)

**Key Logic**:
```typescript
// Derive agent-task mapping
const agentTasks = useMemo(() => {
  const taskMap: Record<string, Task | undefined> = {};
  agents.forEach(agent => {
    const currentTask = tasks.find(
      t => t.assigned_agent_id === agent.id && t.status === 'in_progress'
    );
    taskMap[agent.id] = currentTask;
  });
  return taskMap;
}, [agents, tasks]);
```

### 2. DeskStation Component

**Location**: `src/components/office/DeskStation.tsx`

**Responsibilities**:
- Render a complete desk station for one agent
- Handle hover interactions
- Display agent avatar, monitor, status, and task info
- Apply appropriate CSS classes based on agent status

**Props**:
```typescript
interface DeskStationProps {
  agent: Agent;
  task?: Task;
  position: { left: string; top: string };
}
```

**State**:
- `isHovered`: boolean (for showing speech bubble and name tag)

**Key Features**:
- Hover state management
- Status-based CSS class application
- Conditional rendering of task information

### 3. ScreenContent Component

**Location**: `src/components/office/ScreenContent.tsx`

**Responsibilities**:
- Render animated monitor screen based on activity type
- Support four animation types: code, graph, chat, idle

**Props**:
```typescript
interface ScreenContentProps {
  type: 'code' | 'graph' | 'chat' | 'idle';
  color?: string;
}
```

**Animation Types**:
- **code**: 5-7 horizontal lines with pulsing animation
- **graph**: 5 vertical bars with growing animation
- **chat**: 3 bubbles appearing sequentially
- **idle**: Blinking cursor

**Status to Animation Mapping**:
```typescript
function getScreenType(status: AgentStatus): ScreenContentProps['type'] {
  switch (status) {
    case 'working': return 'code';
    case 'standby': return 'idle';
    case 'offline': return 'idle';
    default: return 'idle';
  }
}
```

### 4. PixelAvatar Component

**Location**: `src/components/office/PixelAvatar.tsx`

**Responsibilities**:
- Render pixel-art avatar on canvas
- Draw character using grid mapping system
- Apply agent-specific color palette

**Props**:
```typescript
interface PixelAvatarProps {
  agentId: string;
  agentName: string;
}
```

**Implementation**:
- Uses HTML5 Canvas API
- 8×10 pixel grid
- Character grid mapping where each character represents a color
- Canvas drawn in `useEffect` after mount

**Avatar Configuration**:
```typescript
interface AvatarConfig {
  colors: Record<string, string>;
  pixels: string[];
}

const OFFICE_AVATARS: Record<string, AvatarConfig> = {
  // Agent-specific configurations
};
```

### 5. GhostDesk Component

**Location**: `src/components/office/GhostDesk.tsx`

**Responsibilities**:
- Render empty desk placeholder
- Show capacity for future agents

**Props**:
```typescript
interface GhostDeskProps {
  position: { left: string; top: string };
}
```

**Features**:
- Dimmed appearance (0.4 opacity)
- No avatar or status indicators
- No hover interactions
- Same desk/monitor structure as active desks

## Data Models

### Agent Position Configuration

```typescript
interface DeskPosition {
  left: string;  // Percentage
  top: string;   // Percentage
}

const DESK_POSITIONS: DeskPosition[] = [
  { left: '14%', top: '48%' },
  { left: '42%', top: '32%' },
  { left: '68%', top: '48%' },
  { left: '28%', top: '58%' },
  // Additional positions as needed
];

const GHOST_POSITIONS: DeskPosition[] = [
  { left: '52%', top: '60%' },
  { left: '74%', top: '62%' },
];
```

### Status Mapping

```typescript
interface StatusConfig {
  dotColor: string;
  dotGlow: boolean;
  screenType: 'code' | 'graph' | 'chat' | 'idle';
  animationClass: string;
}

const STATUS_CONFIG: Record<AgentStatus, StatusConfig> = {
  working: {
    dotColor: '#00ff88',
    dotGlow: true,
    screenType: 'code',
    animationClass: 'state-working',
  },
  standby: {
    dotColor: '#ffcc00',
    dotGlow: true,
    screenType: 'idle',
    animationClass: 'state-idle',
  },
  offline: {
    dotColor: '#555577',
    dotGlow: false,
    screenType: 'idle',
    animationClass: 'state-idle',
  },
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After analyzing the acceptance criteria, I've identified the following testable properties and examples. Many of the requirements focus on visual styling (CSS properties, animations, positioning) which are not valuable to test programmatically. The properties below focus on functional behavior and component structure.

### Property Reflection

Before listing the final properties, I reviewed all testable items from the prework to eliminate redundancy:

- **3.1** (render one desk per agent) is the core property for desk rendering
- **7.2** (access agent properties) and **7.4** (update on state change) can be combined into a single property about state integration
- **8.2** (display task text) and **8.3** (display "Standing by...") are complementary - one is the general case, one is the edge case
- **11.3** (name tag displays agent name) is subsumed by the general property that all agent data is correctly displayed

The properties below represent the unique, non-redundant functional requirements.

### Property 1: One Desk Station Per Agent

*For any* list of agents from the store, the Office View should render exactly one DeskStation component for each agent.

**Validates: Requirements 3.1**

### Property 2: Agent State Integration and Reactivity

*For any* agent in the store, the Office View should access and display the agent's name, status, and avatar_emoji properties, and should update the display when these properties change.

**Validates: Requirements 7.2, 7.4**

### Property 3: Task Display in Speech Bubble

*For any* agent with a current task, when hovering over their desk station, the speech bubble should display the task's title or description.

**Validates: Requirements 8.2**

### Property 4: Name Tag Display

*For any* agent, when hovering over their desk station, the name tag should display the agent's name.

**Validates: Requirements 11.3**

### Example Tests

The following are specific examples that should be verified through unit tests:

**Example 1: Navigation Entry Exists**
- The sidebar navigation should include an entry labeled "Office" with icon 🏢
- **Validates: Requirements 1.1**

**Example 2: Route Navigation**
- Clicking the Office navigation entry should navigate to the office route
- **Validates: Requirements 1.2**

**Example 3: Route Accessibility**
- The Office View should be accessible via `/workspace/[slug]/office`
- **Validates: Requirements 1.3**

**Example 4: Window Panes Rendered**
- The windows row should display at least 8 window pane elements
- **Validates: Requirements 2.3**

**Example 5: Monitor Structure**
- Each DeskStation should include monitor stand and base elements
- **Validates: Requirements 3.5**

**Example 6: Canvas Avatar**
- Each DeskStation should render a canvas element for the pixel avatar
- **Validates: Requirements 4.1**

**Example 7: Working Status Animation**
- When agent status is 'working', the screen animation should display type 'code'
- **Validates: Requirements 5.1**

**Example 8: Chat Status Animation**
- When agent status indicates conversation, the screen animation should display type 'chat'
- **Validates: Requirements 5.3**

**Example 9: Idle Status Animation**
- When agent status is 'standby' or 'offline', the screen animation should display type 'idle'
- **Validates: Requirements 5.4**

**Example 10: Working Status Dot Color**
- When agent status is 'working', the status dot should display color #00ff88
- **Validates: Requirements 6.2**

**Example 11: Standby Status Dot Color**
- When agent status is 'standby', the status dot should display color #ffcc00
- **Validates: Requirements 6.3**

**Example 12: Offline Status Dot Color**
- When agent status is 'offline', the status dot should display color #555577
- **Validates: Requirements 6.4**

**Example 13: Store Integration**
- The Office View should read agent data from the useMissionControl store
- **Validates: Requirements 7.1**

**Example 14: Task Derivation**
- The Office View should derive the current task from the tasks array in state
- **Validates: Requirements 7.3**

**Example 15: Speech Bubble Visibility on Hover**
- When hovering over a DeskStation, the speech bubble should become visible
- **Validates: Requirements 8.1**

**Edge Case 1: No Current Task**
- When an agent has no current task, the speech bubble should display "Standing by..."
- **Validates: Requirements 8.3**

**Example 16: Ghost Desks Rendered**
- The Office View should render at least 2 GhostDesk components
- **Validates: Requirements 10.1**

**Example 17: Ghost Desk Structure**
- Each GhostDesk should include desk and monitor elements but no avatar or status indicators
- **Validates: Requirements 10.3**

**Example 18: Name Tag Visibility on Hover**
- When hovering over a DeskStation, the name tag should become visible
- **Validates: Requirements 11.2**

**Example 19: Component Structure - OfficeView**
- The implementation should include an OfficeView parent component
- **Validates: Requirements 13.1**

**Example 20: Component Structure - DeskStation**
- The implementation should include a DeskStation component accepting agent, status, and task props
- **Validates: Requirements 13.2**

**Example 21: Component Structure - ScreenContent**
- The implementation should include a ScreenContent component accepting type and color props
- **Validates: Requirements 13.3**

**Example 22: Component Structure - GhostDesk**
- The implementation should include a GhostDesk component accepting position props
- **Validates: Requirements 13.4**

## Error Handling

### Component Error Boundaries

The Office View should implement error boundaries to gracefully handle rendering errors:

```typescript
// Wrap OfficeView in error boundary
<ErrorBoundary fallback={<OfficeErrorFallback />}>
  <OfficeView />
</ErrorBoundary>
```

**Error Scenarios**:
1. **Missing Agent Data**: If agent data is malformed or missing required properties, render a placeholder or skip that desk
2. **Canvas Rendering Failure**: If canvas API is unavailable or fails, fall back to emoji display
3. **Invalid Status Values**: If agent status is not a recognized value, default to 'offline'

### Defensive Programming

**Avatar Configuration**:
```typescript
function getAvatarConfig(agentId: string): AvatarConfig | null {
  const config = OFFICE_AVATARS[agentId.toLowerCase()];
  if (!config) {
    console.warn(`No avatar configuration found for agent: ${agentId}`);
    return null;
  }
  return config;
}
```

**Task Derivation**:
```typescript
function getCurrentTask(agentId: string, tasks: Task[]): Task | undefined {
  try {
    return tasks.find(
      t => t.assigned_agent_id === agentId && t.status === 'in_progress'
    );
  } catch (error) {
    console.error('Error deriving current task:', error);
    return undefined;
  }
}
```

**Canvas Drawing**:
```typescript
function drawAvatar(canvas: HTMLCanvasElement | null, config: AvatarConfig) {
  if (!canvas) return;
  
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas 2D context not available');
      return;
    }
    
    // Drawing logic...
  } catch (error) {
    console.error('Error drawing avatar:', error);
  }
}
```

## Testing Strategy

### Dual Testing Approach

The Office View will be tested using both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and component structure
- Verify navigation entry exists with correct label and icon
- Test status-to-animation mapping for each status value
- Test status-to-color mapping for status dots
- Verify component structure (presence of required elements)
- Test hover interactions (speech bubble and name tag visibility)
- Test edge case: agent with no current task shows "Standing by..."
- Test ghost desk rendering and structure

**Property-Based Tests**: Verify universal properties across all inputs
- Property 1: For any agent list, render exactly one desk per agent
- Property 2: For any agent, correctly display name, status, and avatar_emoji
- Property 3: For any agent with a task, display task in speech bubble on hover
- Property 4: For any agent, display name in name tag on hover

### Testing Framework

**Unit Testing**:
- Framework: Jest + React Testing Library
- Location: `src/components/office/__tests__/`
- Focus: Component rendering, user interactions, conditional logic

**Property-Based Testing**:
- Framework: fast-check (JavaScript property-based testing library)
- Configuration: Minimum 100 iterations per property test
- Tag format: `Feature: office-view, Property {number}: {property_text}`

### Test Organization

```
src/components/office/
├── __tests__/
│   ├── OfficeView.test.tsx          # Unit tests for main view
│   ├── DeskStation.test.tsx         # Unit tests for desk station
│   ├── ScreenContent.test.tsx       # Unit tests for animations
│   ├── PixelAvatar.test.tsx         # Unit tests for avatar rendering
│   ├── GhostDesk.test.tsx           # Unit tests for ghost desks
│   └── office.properties.test.tsx   # Property-based tests
```

### Example Property Test Structure

```typescript
import fc from 'fast-check';

describe('Office View Properties', () => {
  it('Property 1: One Desk Station Per Agent', () => {
    // Feature: office-view, Property 1: For any list of agents, render exactly one desk per agent
    fc.assert(
      fc.property(
        fc.array(agentArbitrary, { minLength: 0, maxLength: 20 }),
        (agents) => {
          const { container } = render(<OfficeView agents={agents} />);
          const deskStations = container.querySelectorAll('.desk-station');
          expect(deskStations.length).toBe(agents.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Route Integration**:
- Test that `/workspace/[slug]/office` route renders OfficeView component
- Test navigation from sidebar to office view
- Test that workspace context is correctly passed to the view

**State Integration**:
- Test that component subscribes to Zustand store
- Test that component re-renders when agent data changes
- Test that component re-renders when task data changes

### Visual Regression Testing (Optional)

For pixel-perfect visual verification, consider using:
- Playwright for screenshot comparison
- Chromatic for visual regression testing
- Focus on overall layout, not individual CSS properties

### Performance Testing

**Rendering Performance**:
- Test with varying numbers of agents (1, 5, 10, 20)
- Measure initial render time
- Measure re-render time on state updates
- Ensure no unnecessary re-renders (use React DevTools Profiler)

**Optimization Strategies**:
- Memoize agent-task mapping with `useMemo`
- Memoize individual DeskStation components with `React.memo`
- Use `useCallback` for event handlers passed to children
- Lazy load canvas drawing logic

### Accessibility Testing

**Keyboard Navigation**:
- Test that desk stations are focusable
- Test that hover information is accessible via focus
- Test that navigation can be done entirely via keyboard

**Screen Reader Support**:
- Add appropriate ARIA labels to desk stations
- Ensure agent names and statuses are announced
- Provide text alternatives for visual-only information

**Testing Tools**:
- axe-core for automated accessibility testing
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)

## Implementation Notes

### Font Loading

The Press Start 2P font should be loaded in the Next.js layout or via next/font:

```typescript
// In layout.tsx or office page
import { Press_Start_2P } from 'next/font/google';

const pixelFont = Press_Start_2P({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-pixel',
});
```

### CSS Organization

All Office View styles will be in `src/app/workspace/[slug]/office/office.css`:
- Use `office-` prefix for all class names
- Import in the OfficeView page component
- Avoid modifying global styles

### Performance Considerations

**Canvas Optimization**:
- Draw avatars only once on mount, not on every render
- Use `useRef` to maintain canvas reference
- Consider using `OffscreenCanvas` for better performance (if browser support allows)

**State Subscription Optimization**:
```typescript
// Only subscribe to agents, not entire store
const agents = useMissionControl(state => state.agents);
const tasks = useMissionControl(state => state.tasks);
```

**Memoization**:
```typescript
// Memoize expensive computations
const agentTasks = useMemo(() => {
  return deriveAgentTasks(agents, tasks);
}, [agents, tasks]);

// Memoize components
const DeskStation = React.memo(DeskStationComponent);
```

### Browser Compatibility

**Canvas Support**: All modern browsers support Canvas API
**CSS Grid/Flexbox**: Use for layout (widely supported)
**CSS Animations**: Use for screen animations (widely supported)
**Image Rendering**: `image-rendering: pixelated` is supported in all modern browsers

### Future Enhancements

Potential future improvements (out of scope for initial implementation):
1. Click on desk to navigate to agent detail view
2. Drag-and-drop to rearrange desk positions
3. Customizable office layouts
4. More animation types based on task categories
5. Sound effects for agent activities
6. Time-of-day lighting effects
7. Agent interaction animations (agents looking at each other, etc.)
8. Customizable avatar editor


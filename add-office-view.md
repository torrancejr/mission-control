# Add "The Office" View — Cursor Instructions

## What to do

1. **First: explore this codebase.** Read the file structure, routing setup, how views/pages are organized, what state management is used, and how the sidebar navigation works. Do not write any code yet.

2. **Then: add a new "Office" view** using the full spec below. Wire it into the existing nav and routing exactly the way other views are wired in. Match the existing code style and conventions — don't introduce new patterns unless necessary.

3. **Do not touch anything outside the Office view** unless the routing/nav requires a small addition.

---

## What the Office view is

A pixel-art isometric office floor where each AI agent has a desk. Agents sit at their desks, their monitors animate based on what they're doing (coding, chatting, idle), a speech bubble shows their current task on hover, and their status dot reflects live state. Empty ghost desks are shown for future agents.

It is purely visual/ambient — a live wallpaper for the agent team. It reads agent state (name, status, currentTask) from whatever state/store already exists in this repo. No new data fetching needed if agents are already tracked.

---

## Visual structure

```
┌─────────────────────────────────────────────────────┐
│  [window] [window] [window] [window] [window] ...   │  ← windows row, top 80px, dark blue
├─────────────────────────────────────────────────────┤
│                                                     │
│   checkerboard floor (dark #1a1a24 / #1e1e2c tiles) │
│                                                     │
│        [desk: Atlas]      [desk: Zephyr]            │
│                                                     │
│  [desk: Ryan]    [desk: Eva]    [ghost] [ghost]     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Each desk station is absolutely positioned on the floor. Positions (as % of container):

| Agent  | left | top |
|--------|------|-----|
| Ryan   | 14%  | 48% |
| Atlas  | 42%  | 32% |
| Zephyr | 68%  | 48% |
| Eva    | 28%  | 58% |
| Ghost 1 | 52% | 60% |
| Ghost 2 | 74% | 62% |

---

## CSS to add

Add this to the view's stylesheet or a scoped CSS module. If the project uses Tailwind only, create a single `office.css` file imported by the view component — these styles are too specific to do cleanly in utilities.

```css
/* ── OFFICE FLOOR ── */
.office-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1a1a24;
}

.office-floor {
  position: absolute;
  inset: 0;
  background-image: repeating-conic-gradient(#1a1a24 0% 25%, #1e1e2c 0% 50%);
  background-size: 48px 48px;
  image-rendering: pixelated;
}

/* ── WINDOWS ROW ── */
.office-windows {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 80px;
  background: #0a1520;
  border-bottom: 4px solid #0d1c2e;
  display: flex;
  gap: 2px;
  padding: 8px 16px;
  overflow: hidden;
  z-index: 2;
}

.window-pane {
  flex: 1;
  background: linear-gradient(180deg, #1a3a5a 0%, #0e2035 60%, #0a1520 100%);
  border: 2px solid #1e3050;
  position: relative;
  overflow: hidden;
}
.window-pane::after {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  width: 2px; height: 100%;
  background: #1e3050;
}
.window-pane::before {
  content: '';
  position: absolute;
  top: 50%; left: 0;
  width: 100%; height: 2px;
  background: #1e3050;
}

/* ── DESK STATION ── */
.desk-station {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.1s;
  z-index: 3;
}
.desk-station:hover { transform: scale(1.05); }
.desk-station:hover .office-speech-bubble { opacity: 1; }
.desk-station:hover .office-name-tag { opacity: 1; }

/* ── DESK ── */
.pixel-desk {
  width: 80px;
  height: 44px;
  background: #352840;
  border: 3px solid #2a2030;
  border-bottom: 6px solid #1a1020;
  position: relative;
  image-rendering: pixelated;
  box-shadow: 4px 4px 0 #0d0a14;
}

/* ── MONITOR ── */
.pixel-monitor {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 32px;
  background: #0a0a12;
  border: 3px solid #2a2a3e;
  box-shadow: 0 0 12px #4488ff, inset 0 0 8px rgba(0, 0, 255, 0.1);
}
.pixel-monitor-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.pixel-monitor-stand {
  position: absolute;
  bottom: -8px; left: 50%;
  transform: translateX(-50%);
  width: 8px; height: 6px;
  background: #2a2a3e;
}
.pixel-monitor-base {
  position: absolute;
  bottom: -14px; left: 50%;
  transform: translateX(-50%);
  width: 20px; height: 4px;
  background: #2a2a3e;
}

/* ── SCREEN TYPES ── */
.screen-code {
  width: 100%; height: 100%;
  background: #050510;
  padding: 2px;
  overflow: hidden;
}
.screen-code-line {
  height: 2px;
  margin-bottom: 2px;
  border-radius: 1px;
  animation: officePulse 2s ease-in-out infinite;
}
.screen-graph {
  width: 100%; height: 100%;
  background: #050510;
  display: flex;
  align-items: flex-end;
  padding: 2px;
  gap: 1px;
}
.screen-graph-bar {
  flex: 1;
  opacity: 0.7;
  animation: officeBarGrow 1.5s ease-in-out infinite alternate;
}
.screen-chat {
  width: 100%; height: 100%;
  background: #050510;
  padding: 2px;
}
.screen-chat-bubble {
  height: 3px;
  margin-bottom: 2px;
  border-radius: 1px;
  opacity: 0;
  animation: officeChatAppear 3s ease-in-out infinite;
}
.screen-idle {
  width: 100%; height: 100%;
  background: #050510;
  display: flex;
  align-items: center;
  justify-content: center;
}
.screen-idle-cursor {
  width: 2px; height: 8px;
  background: #555577;
  animation: officeBlink 1s step-end infinite;
}

/* ── AGENT BODY ── */
.office-agent-body {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px; height: 28px;
  image-rendering: pixelated;
}
.office-agent-body canvas {
  image-rendering: pixelated;
  width: 28px; height: 28px;
}

/* ── STATUS DOT ── */
.office-avatar-status {
  position: absolute;
  top: -6px; right: -2px;
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 2px solid #0d0d0f;
  z-index: 10;
}

/* ── NAME TAG ── */
.office-name-tag {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #1e1e2e;
  padding: 3px 6px;
  font-size: 6px;
  color: #fff;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  font-family: 'Press Start 2P', monospace;
}

/* ── SPEECH BUBBLE ── */
.office-speech-bubble {
  position: absolute;
  background: #1a1a2e;
  border: 2px solid #1e1e2e;
  padding: 4px 8px;
  font-size: 6px;
  color: #c8c8e0;
  white-space: nowrap;
  bottom: 68px;
  left: 50%;
  transform: translateX(-20%);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  font-family: 'Press Start 2P', monospace;
}
.office-speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px; left: 16px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #1e1e2e;
}

/* ── GHOST DESK ── */
.ghost-desk {
  position: absolute;
  opacity: 0.4;
}
.ghost-desk .pixel-monitor {
  box-shadow: none;
  border-color: #1a1a2a;
}
.ghost-desk .pixel-monitor-screen {
  background: #0a0a0a;
}

/* ── ANIMATIONS ── */
@keyframes officeWorkBob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-2px); }
}
@keyframes officeIdleFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-4px); }
}
.state-working .office-agent-body  { animation: officeWorkBob 0.6s ease-in-out infinite; }
.state-chatting .office-agent-body { animation: officeWorkBob 1.2s ease-in-out infinite; }
.state-idle .office-agent-body     { animation: officeIdleFloat 2s ease-in-out infinite; }

@keyframes officePulse    { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes officeBarGrow  { from{transform:scaleY(.4)} to{transform:scaleY(1)} }
@keyframes officeChatAppear {
  0%   { opacity:0; width:30%; }
  20%  { opacity:.8; width:80%; }
  80%  { opacity:.8; }
  100% { opacity:0; }
}
@keyframes officeBlink { 0%,100%{opacity:1} 50%{opacity:0} }
```

---

## Pixel Avatar System

Each agent has a tiny 8×10 canvas drawn with pixel art. The drawing function uses a character grid where each letter maps to a color.

```js
// Add this object — one entry per agent
// Customize colors per agent to make them distinct
const OFFICE_AVATARS = {
  ryan: {
    colors: { H: '#f5c5a3', B: '#2255aa', P: '#1a3a7a', G: '#ffcc00' },
    pixels: [
      '0HHHHHH0',
      'HHHHHHHH',
      'H0H00H0H',
      'HHHHHHHH',
      '0HHHHH0H',
      '0BBBBB00',
      'BBBBBBB0',
      'BBPPPBB0',
      '0BB0BB00',
      '0GG0GG00',
    ],
  },
  atlas: {
    colors: { H: '#c8a8e8', B: '#442266', P: '#331155', G: '#aa55ff' },
    pixels: [
      '0HHHHHH0','HHHHHHHH','H0H00H0H','HHHHHHHH','0HHHHH0H',
      '0BBBBB00','BBBBBBB0','BBPPPBB0','0BB0BB00','0GG0GG00',
    ],
  },
  zephyr: {
    colors: { H: '#a8d8a8', B: '#226622', P: '#114411', G: '#00ff88' },
    pixels: [
      '0HHHHHH0','HHHHHHHH','H0H00H0H','HHHHHHHH','0HHHHH0H',
      '0BBBBB00','BBBBBBB0','BBPPPBB0','0BB0BB00','0GG0GG00',
    ],
  },
  eva: {
    colors: { H: '#f8d8b8', B: '#aa3366', P: '#771133', G: '#ff88aa' },
    pixels: [
      '0HHHHHH0','HHHHHHHH','H0H00H0H','HHHHHHHH','0HHHHH0H',
      '0BBBBB00','BBBBBBB0','BBPPPBB0','0BB0BB00','0GG0GG00',
    ],
  },
}

function drawOfficeAvatar(canvas, agentKey) {
  if (!canvas) return
  const agent = OFFICE_AVATARS[agentKey]
  if (!agent) return
  const ctx = canvas.getContext('2d')
  canvas.width = 8
  canvas.height = 10
  agent.pixels.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '0') continue
      ctx.fillStyle = agent.colors[ch] || '#ff00ff'
      ctx.fillRect(x, y, 1, 1)
    }
  })
}
```

Call `drawOfficeAvatar(canvasEl, 'atlas')` after the canvas mounts (in `useEffect` if React, `onMounted` if Vue, etc.).

---

## Agent config

Map your existing agent data to this shape for the Office view:

```js
// Derive this from whatever agent state already exists in the repo
const DESK_AGENTS = [
  {
    id: 'ryan',
    name: 'Ryan',
    emoji: '👤',
    position: { left: '14%', top: '48%' },
    screenType: 'graph',   // 'code' | 'graph' | 'chat' | 'idle'
    screenColor: '#4488ff',
    statusColor: '#4488ff',
  },
  {
    id: 'atlas',
    name: 'Atlas 😈',
    emoji: '😈',
    position: { left: '42%', top: '32%' },
    screenType: 'chat',
    screenColor: '#aa55ff',
    statusColor: '#00ff88',
  },
  {
    id: 'zephyr',
    name: 'Zephyr 🧑🏼‍💻',
    emoji: '🧑🏼‍💻',
    position: { left: '68%', top: '48%' },
    screenType: 'code',
    screenColor: '#4488ff',
    statusColor: '#00ff88',
  },
  {
    id: 'eva',
    name: 'Eva ✦',
    emoji: '✦',
    position: { left: '28%', top: '58%' },
    screenType: 'idle',
    screenColor: null,
    statusColor: '#ffcc00',
  },
]

// Map agent status → CSS state class
function getStateClass(status) {
  if (status === 'working')  return 'state-working'
  if (status === 'chatting') return 'state-chatting'
  if (status === 'idle')     return 'state-idle'
  return 'state-idle'
}

// Map agent status → dot color
function getStatusColor(status) {
  if (status === 'working')  return '#00ff88'
  if (status === 'chatting') return '#4488ff'
  if (status === 'idle')     return '#ffcc00'
  return '#555577'
}
```

---

## Component structure (framework-agnostic pseudocode)

```
<OfficeView>
  <div class="office-viewport">
    <div class="office-floor" />                        ← checkerboard bg
    <div class="office-windows">
      <div class="window-pane" /> × 8
    </div>

    FOR each agent in DESK_AGENTS:
      <DeskStation
        agent={agent}
        liveStatus={getAgentStatus(agent.id)}           ← from existing state
        liveTask={getAgentCurrentTask(agent.id)}        ← from existing state
        onClick={() => navigateToAgent(agent.id)}       ← whatever agent detail route exists
      />

    <!-- Ghost desks (empty, dimmed, no agent) -->
    <GhostDesk position={{ left: '52%', top: '60%' }} />
    <GhostDesk position={{ left: '74%', top: '62%' }} />
  </div>
</OfficeView>

<DeskStation agent status task onClick>
  <div class="desk-station {getStateClass(status)}" style="left:{pos.left}; top:{pos.top}">
    <div class="office-speech-bubble">{task ?? 'Standing by...'}</div>
    <div class="pixel-desk">
      <div class="pixel-monitor">
        <div class="pixel-monitor-screen">
          <ScreenContent type={agent.screenType} color={agent.screenColor} />
        </div>
        <div class="pixel-monitor-stand" />
        <div class="pixel-monitor-base" />
      </div>
    </div>
    <div class="office-agent-body">
      <canvas ref={canvasRef} />                        ← drawOfficeAvatar on mount
    </div>
    <div
      class="office-avatar-status"
      style="background:{getStatusColor(status)}; box-shadow: 0 0 6px {getStatusColor(status)}"
    />
    <div class="office-name-tag">{agent.name}</div>
  </div>
</DeskStation>

<ScreenContent type color>
  if type === 'code':
    <div class="screen-code">
      5–7 <div class="screen-code-line"> with varying widths, colors cycling blue/purple/green
    </div>
  if type === 'graph':
    <div class="screen-graph">
      5 <div class="screen-graph-bar" style="background:{color}; animation-delay:{i*0.2}s">
    </div>
  if type === 'chat':
    <div class="screen-chat">
      3 <div class="screen-chat-bubble"> — child 2 gets animation-delay:1s + purple, child 3 delay:2s
    </div>
  if type === 'idle':
    <div class="screen-idle">
      <div class="screen-idle-cursor" />
    </div>
</ScreenContent>

<GhostDesk position>
  <div class="ghost-desk" style="position:absolute; left:{pos.left}; top:{pos.top}">
    <div class="pixel-desk">
      <div class="pixel-monitor">
        <div class="pixel-monitor-screen" />
        <div class="pixel-monitor-stand" />
        <div class="pixel-monitor-base" />
      </div>
    </div>
  </div>
</GhostDesk>
```

---

## Font dependency

The Office view uses `Press Start 2P`. Check if the fork already loads it. If not, add to the document head or global stylesheet:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

Or in Next.js:
```ts
import { Press_Start_2P } from 'next/font/google'
const pixelFont = Press_Start_2P({ subsets: ['latin'], weight: '400' })
```

---

## Sidebar nav entry

Find where the existing sidebar nav items are defined and add:

```
{ id: 'office', label: 'Office', icon: '🏢' }
```

Match the exact shape of the other nav items already there.

---

## What NOT to do

- Do not replace or rewrite any existing views
- Do not change the routing setup beyond adding one route/view
- Do not add new state management — read from whatever already exists
- Do not add new dependencies for this view — it's pure CSS + canvas
- Do not hard-code agent names — pull them from the existing agent list in the repo

---

## Summary of files to create or touch

| File | Action |
|---|---|
| `components/views/OfficeView` (`.tsx` / `.vue` / `.jsx`) | **Create** |
| `components/office/DeskStation` | **Create** |
| `components/office/ScreenContent` | **Create** |
| `components/office/GhostDesk` | **Create** |
| `styles/office.css` (or scoped styles in component) | **Create** |
| Sidebar nav config | **Add one entry** |
| Router config | **Add one route** |

That's it. Keep the scope tight.

'use client';

import { useMemo } from 'react';
import { Press_Start_2P } from 'next/font/google';
import { useMissionControl } from '@/lib/store';
import type { Task } from '@/lib/types';
import DeskStation from '@/components/office/DeskStation';
import GhostDesk from '@/components/office/GhostDesk';
import './office.css';

const pixelFont = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pixel',
  display: 'swap',
});

// Desk positions for agents (percentage-based for responsive layout)
// Pyramid layout: top center, middle center, bottom left, bottom right
const DESK_POSITIONS = [
  { left: '50%', top: '25%' },  // First agent: top center
  { left: '50%', top: '45%' },  // Second agent: middle center
  { left: '30%', top: '65%' },  // Third agent: bottom left
  { left: '70%', top: '65%' },  // Fourth agent: bottom right
  { left: '52%', top: '42%' },  // Additional positions if needed
  { left: '74%', top: '35%' },
];

// Ghost desk positions (empty desks for future agents)
const GHOST_POSITIONS = [
  { left: '52%', top: '60%' },
  { left: '74%', top: '62%' },
];

// Status configuration mapping for status-specific styling
const STATUS_CONFIG = {
  working: {
    dotColor: '#00ff88',
    dotGlow: true,
    screenType: 'code' as const,
    animationClass: 'state-working',
  },
  standby: {
    dotColor: '#ffcc00',
    dotGlow: true,
    screenType: 'idle' as const,
    animationClass: 'state-idle',
  },
  offline: {
    dotColor: '#555577',
    dotGlow: false,
    screenType: 'idle' as const,
    animationClass: 'state-idle',
  },
};

export default function OfficePage() {
  // Subscribe to agents and tasks from Zustand store
  const agents = useMissionControl((state) => state.agents);
  const tasks = useMissionControl((state) => state.tasks);

  // Derive agent-task mapping using useMemo for performance
  const agentTasks = useMemo(() => {
    const taskMap: Record<string, Task | undefined> = {};
    agents.forEach((agent) => {
      const currentTask = tasks.find(
        (t) => t.assigned_agent_id === agent.id && t.status === 'in_progress'
      );
      taskMap[agent.id] = currentTask;
    });
    return taskMap;
  }, [agents, tasks]);

  return (
    <div className={`office-viewport ${pixelFont.variable}`}>
      {/* Checkerboard floor background */}
      <div className="office-floor" />

      {/* Windows row at the top */}
      <div className="office-windows">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="office-window-pane" />
        ))}
      </div>

      {/* Render desk stations for each agent */}
      {agents.map((agent, index) => {
        const position = DESK_POSITIONS[index % DESK_POSITIONS.length];
        const task = agentTasks[agent.id];
        
        return (
          <DeskStation
            key={agent.id}
            agent={agent}
            task={task}
            position={position}
          />
        );
      })}

      {/* Render ghost desks (empty desks for future agents) */}
      {GHOST_POSITIONS.map((position, index) => (
        <GhostDesk
          key={`ghost-${index}`}
          position={position}
        />
      ))}
    </div>
  );
}

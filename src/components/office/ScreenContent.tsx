// ScreenContent Component
// Renders animated monitor screen based on activity type

import type { AgentStatus } from '@/lib/types';

interface ScreenContentProps {
  type: 'code' | 'graph' | 'chat' | 'idle';
  color?: string;
}

// Status to animation type mapping function
export function getScreenType(status: AgentStatus): ScreenContentProps['type'] {
  switch (status) {
    case 'working':
      return 'code';
    case 'standby':
      return 'idle';
    case 'offline':
      return 'idle';
    default:
      return 'idle';
  }
}

export default function ScreenContent({ type, color = '#4488ff' }: ScreenContentProps) {
  // Code animation: 5-7 pulsing horizontal lines
  if (type === 'code') {
    const lines = [
      { width: '80%', color: '#4488ff' },
      { width: '60%', color: '#aa55ff' },
      { width: '90%', color: '#00ff88' },
      { width: '70%', color: '#4488ff' },
      { width: '85%', color: '#aa55ff' },
      { width: '65%', color: '#00ff88' },
      { width: '75%', color: '#4488ff' },
    ];

    return (
      <div className="office-screen-code">
        {lines.map((line, i) => (
          <div
            key={i}
            className="office-screen-code-line"
            style={{
              width: line.width,
              background: line.color,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // Graph animation: 5 growing vertical bars
  if (type === 'graph') {
    const bars = [
      { height: '60%' },
      { height: '80%' },
      { height: '50%' },
      { height: '90%' },
      { height: '70%' },
    ];

    return (
      <div className="office-screen-graph">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="office-screen-graph-bar"
            style={{
              height: bar.height,
              background: color,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // Chat animation: 3 sequential bubbles
  if (type === 'chat') {
    const bubbles = [
      { width: '70%', color: '#4488ff', delay: '0s' },
      { width: '60%', color: '#aa55ff', delay: '1s' },
      { width: '80%', color: '#4488ff', delay: '2s' },
    ];

    return (
      <div className="office-screen-chat">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className="office-screen-chat-bubble"
            style={{
              width: bubble.width,
              background: bubble.color,
              animationDelay: bubble.delay,
            }}
          />
        ))}
      </div>
    );
  }

  // Idle animation: blinking cursor
  return (
    <div className="office-screen-idle">
      <div className="office-screen-idle-cursor" />
    </div>
  );
}

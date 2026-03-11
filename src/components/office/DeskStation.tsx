// DeskStation Component
// Renders a complete desk station for one agent

import { useState } from 'react';
import { Agent, Task } from '@/lib/types';
import ScreenContent, { getScreenType } from './ScreenContent';
import PixelAvatar from './PixelAvatar';

interface DeskStationProps {
  agent: Agent;
  task?: Task;
  position: { left: string; top: string };
}

export default function DeskStation({ agent, task, position }: DeskStationProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Status-to-color mapping
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'working':
        return '#00ffaa';
      case 'standby':
        return '#ffdd00';
      case 'offline':
        return '#555577';
      default:
        return '#555577';
    }
  };

  // Determine if glow effect should be applied
  const hasGlow = agent.status === 'working' || agent.status === 'standby';
  const statusColor = getStatusColor(agent.status);
  const screenType = getScreenType(agent.status);

  // Enhanced glow effect for status dots
  const getGlowEffect = () => {
    if (!hasGlow) return 'none';
    
    if (agent.status === 'working') {
      return `0 0 12px ${statusColor}, 0 0 20px ${statusColor}, 0 0 28px ${statusColor}`;
    }
    if (agent.status === 'standby') {
      return `0 0 12px ${statusColor}, 0 0 20px ${statusColor}, 0 0 28px ${statusColor}`;
    }
    return 'none';
  };

  // Determine animation class based on status
  const getAnimationClass = () => {
    switch (agent.status) {
      case 'working':
        return 'state-working';
      case 'standby':
      case 'offline':
        return 'state-idle';
      default:
        return 'state-idle';
    }
  };

  return (
    <div
      className="office-desk-station"
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desk */}
      <div className="office-pixel-desk">
        {/* Agent Name Label - shown on hover */}
        <div className={`office-agent-name-label ${isHovered ? 'office-hover' : ''}`}>
          {agent.name}
        </div>

        {/* Agent Avatar - positioned at bottom center of desk */}
        <div className={`office-agent-body office-${getAnimationClass()}`}>
          <PixelAvatar agentId={agent.id} agentName={agent.name} />
        </div>

        {/* Monitor */}
        <div className="office-pixel-monitor">
          <div className="office-pixel-monitor-screen">
            <ScreenContent type={screenType} />
          </div>
          {/* Monitor Stand */}
          <div className="office-pixel-monitor-stand" />
          {/* Monitor Base */}
          <div className="office-pixel-monitor-base" />
        </div>

        {/* Status Dot - positioned at top-right of avatar area */}
        <div
          className="office-avatar-status"
          style={{
            backgroundColor: statusColor,
            boxShadow: getGlowEffect(),
          }}
        />
      </div>

      {/* Speech Bubble - shown on hover */}
      <div className="office-speech-bubble" style={{ opacity: isHovered ? 1 : 0 }}>
        {task?.title || task?.description || 'Standing by...'}
      </div>
    </div>
  );
}

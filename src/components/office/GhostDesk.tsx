// GhostDesk Component
// Renders empty desk placeholder for future agents

interface GhostDeskProps {
  position: { left: string; top: string };
}

export default function GhostDesk({ position }: GhostDeskProps) {
  return (
    <div 
      className="office-ghost-desk"
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
      }}
    >
      {/* Desk */}
      <div className="office-pixel-desk">
        {/* Monitor - no glow or screen animation */}
        <div className="office-pixel-monitor">
          <div className="office-pixel-monitor-screen">
            {/* Empty screen - no animation */}
          </div>
          {/* Monitor Stand */}
          <div className="office-pixel-monitor-stand" />
          {/* Monitor Base */}
          <div className="office-pixel-monitor-base" />
        </div>
      </div>

      {/* No avatar, no status dot, no hover effects */}
    </div>
  );
}

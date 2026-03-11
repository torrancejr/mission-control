# Implementation Plan: Office View

## Overview

This plan implements the Office View feature as an ambient visualization of AI agents in an isometric office environment. The implementation follows Next.js App Router conventions, integrates with the existing Zustand state management, and uses modular React components with TypeScript. The feature is purely presentational, reading from existing state without introducing new data fetching mechanisms.

## Tasks

- [x] 1. Set up project structure and routing
  - Create `/src/app/workspace/[slug]/office/page.tsx` route file
  - Create `/src/components/office/` directory for components
  - Create `/src/app/workspace/[slug]/office/office.css` for styles
  - Set up Press Start 2P font loading using next/font
  - _Requirements: 1.3, 12.1, 13.5, 14.1_

- [x] 2. Implement OfficeView page component
  - [x] 2.1 Create OfficeView component with workspace context
    - Extract workspace slug from URL params
    - Subscribe to useMissionControl store for agents and tasks
    - Implement agent-task mapping logic using useMemo
    - Render office environment structure (windows row, checkerboard floor)
    - _Requirements: 2.1, 2.2, 7.1, 7.2, 7.3, 7.4, 13.1, 15.1, 15.2, 15.3_
  
  - [ ]* 2.2 Write property test for desk rendering
    - **Property 1: One Desk Station Per Agent**
    - **Validates: Requirements 3.1**
  
  - [ ]* 2.3 Write unit tests for OfficeView
    - Test windows row renders with at least 8 panes
    - Test checkerboard floor renders
    - Test route accessibility at `/workspace/[slug]/office`
    - _Requirements: 2.3, 2.4, 1.3_

- [x] 3. Implement DeskStation component
  - [x] 3.1 Create DeskStation component structure
    - Define DeskStationProps interface (agent, task, position)
    - Implement hover state management
    - Render desk, monitor, and monitor stand elements
    - Apply absolute positioning based on position prop
    - Implement hover scale animation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.5, 13.2_
  
  - [ ]* 3.2 Write property test for agent state integration
    - **Property 2: Agent State Integration and Reactivity**
    - **Validates: Requirements 7.2, 7.4**
  
  - [ ]* 3.3 Write unit tests for DeskStation
    - Test desk structure includes monitor stand and base
    - Test hover scale animation triggers
    - Test absolute positioning applied correctly
    - _Requirements: 3.5, 11.1_

- [x] 4. Implement PixelAvatar component
  - [x] 4.1 Create PixelAvatar component with canvas rendering
    - Define PixelAvatarProps interface (agentId, agentName)
    - Create avatar configuration mapping (OFFICE_AVATARS)
    - Implement canvas drawing logic in useEffect
    - Draw 8×10 pixel grid using character-to-color mapping
    - Apply pixelated image rendering
    - Implement status-based animation classes (bob, float)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 4.2 Write unit tests for PixelAvatar
    - Test canvas element renders
    - Test avatar configuration lookup
    - Test fallback for missing configuration
    - _Requirements: 4.1_

- [x] 5. Implement ScreenContent component
  - [x] 5.1 Create ScreenContent component with animations
    - Define ScreenContentProps interface (type, color)
    - Implement 'code' animation (5-7 pulsing horizontal lines)
    - Implement 'graph' animation (5 growing vertical bars)
    - Implement 'chat' animation (3 sequential bubbles)
    - Implement 'idle' animation (blinking cursor)
    - Create status-to-animation-type mapping function
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 13.3_
  
  - [ ]* 5.2 Write unit tests for ScreenContent
    - Test 'working' status maps to 'code' animation
    - Test 'standby' status maps to 'idle' animation
    - Test 'offline' status maps to 'idle' animation
    - Test animation elements render correctly
    - _Requirements: 5.1, 5.4_

- [x] 6. Implement status indicators and hover elements
  - [x] 6.1 Add StatusDot to DeskStation
    - Render status dot with 8px × 8px dimensions
    - Implement status-to-color mapping (#00ff88, #ffcc00, #555577)
    - Apply glow effect for 'working' and 'standby' statuses
    - Position at top-right of avatar area
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 6.2 Add SpeechBubble to DeskStation
    - Render speech bubble with opacity transition on hover
    - Display current task text or "Standing by..." fallback
    - Position 68px above desk with 140px max width
    - Add downward-pointing triangle indicator
    - Apply Press Start 2P font at 6px size
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 12.2_
  
  - [x] 6.3 Add NameTag to DeskStation
    - Render name tag with opacity transition on hover
    - Display agent name using Press Start 2P font at 6px size
    - Position 22px below desk
    - _Requirements: 11.2, 11.3, 11.4, 12.3_
  
  - [ ]* 6.4 Write property test for task display
    - **Property 3: Task Display in Speech Bubble**
    - **Validates: Requirements 8.2**
  
  - [ ]* 6.5 Write property test for name tag display
    - **Property 4: Name Tag Display**
    - **Validates: Requirements 11.3**
  
  - [ ]* 6.6 Write unit tests for status indicators
    - Test working status dot color (#00ff88)
    - Test standby status dot color (#ffcc00)
    - Test offline status dot color (#555577)
    - Test speech bubble visibility on hover
    - Test name tag visibility on hover
    - Test "Standing by..." fallback when no task
    - _Requirements: 6.2, 6.3, 6.4, 8.1, 8.3, 11.2_

- [x] 7. Implement GhostDesk component
  - [x] 7.1 Create GhostDesk component
    - Define GhostDeskProps interface (position)
    - Render desk and monitor structure (no avatar or status)
    - Apply 0.4 opacity for dimmed appearance
    - Position at least 2 ghost desks using predefined coordinates
    - Remove glow effects and screen animations
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 13.4_
  
  - [ ]* 7.2 Write unit tests for GhostDesk
    - Test at least 2 ghost desks render
    - Test ghost desk structure (desk and monitor, no avatar)
    - Test opacity is 0.4
    - _Requirements: 10.1, 10.3_

- [x] 8. Implement styling and visual polish
  - [x] 8.1 Create office.css with all component styles
    - Define checkerboard floor pattern with 48px tiles
    - Define windows row styles with grid dividers
    - Define desk and monitor pixel-art styles
    - Define animation keyframes (bob, float, pulse, grow, appear)
    - Define hover transition styles
    - Use "office-" prefix for all class names
    - _Requirements: 2.1, 2.2, 2.4, 3.3, 3.4, 9.4, 14.1, 14.2, 14.3_
  
  - [x] 8.2 Define desk position configurations
    - Create DESK_POSITIONS array with percentage-based coordinates
    - Create GHOST_POSITIONS array for empty desks
    - Create STATUS_CONFIG mapping for status-specific styling
    - _Requirements: 3.2, 15.4_

- [x] 9. Integrate navigation and finalize
  - [x] 9.1 Add Office entry to sidebar navigation
    - Add navigation entry labeled "Office" with 🏢 icon
    - Configure route navigation to `/workspace/[slug]/office`
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 9.2 Write unit tests for navigation
    - Test navigation entry exists with correct label and icon
    - Test clicking navigation navigates to office route
    - _Requirements: 1.1, 1.2_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation uses TypeScript as specified in the design document
- Property-based tests use fast-check with minimum 100 iterations
- Unit tests use Jest + React Testing Library
- All components integrate with existing Zustand useMissionControl store
- No new data fetching mechanisms are introduced
- Styling is isolated in office.css with "office-" prefix for namespacing

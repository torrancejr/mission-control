// PixelAvatar Component
// Renders pixel-art avatar on canvas with dynamically generated colors
'use client';

import { useEffect, useRef } from 'react';

interface PixelAvatarProps {
  agentId: string;
  agentName: string;
}

// Simple hash function to generate consistent numbers from agent ID
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Pokémon designs with authentic colors
interface PokemonDesign {
  name: string;
  pattern: string[];
  colors: Record<string, string>;
}

const POKEMON_DESIGNS: PokemonDesign[] = [
  // Pikachu - Electric yellow mouse
  {
    name: 'Pikachu',
    pattern: [
      '0BYYYB00',
      'BYYYYYYY',
      'YYBYYBYY',
      'YYYYYYYY',
      'YYRRRYYY',
      '0YYYYYY0',
      '00YYYY00',
      '0BYYBBY0',
      '0BYYBBY0',
      '0BB00BB0',
    ],
    colors: {
      Y: '#FFD700', // Yellow body
      B: '#000000', // Black outline/eyes
      R: '#FF6B6B', // Red cheeks
    },
  },
  // Charmander - Fire lizard
  {
    name: 'Charmander',
    pattern: [
      '00OOOO00',
      '0OOOOOO0',
      'OOBOOBO0',
      'OOOOOOOO',
      '0OYYYOO0',
      '00YYYY00',
      '0OYYYOO0',
      '0OYY0YO0',
      '0OYY0YO0',
      '000R0000',
    ],
    colors: {
      O: '#FF8C42', // Orange body
      Y: '#FFD966', // Yellow belly
      B: '#000000', // Black eyes
      R: '#FF4444', // Red tail flame
    },
  },
  // Bulbasaur - Grass/poison starter
  {
    name: 'Bulbasaur',
    pattern: [
      '00GGGG00',
      '0GGGGGG0',
      '0GTGGTG0',
      '0GGGGGG0',
      '0GGRRGG0',
      '00TTTT00',
      '0TTTTTT0',
      '0TT00TT0',
      '0TT00TT0',
      '0BB00BB0',
    ],
    colors: {
      G: '#5FBD58', // Green bulb
      T: '#7FCDCD', // Teal body
      R: '#FF6B6B', // Red eyes
      B: '#000000', // Black feet
    },
  },
  // Squirtle - Water turtle
  {
    name: 'Squirtle',
    pattern: [
      '00BBBB00',
      '0BBBBBB0',
      'BBWBBWBB',
      'BBBBBBBB',
      '0BYYYB00',
      '00YYYY00',
      '0BYYYB00',
      '0BYYBB00',
      '0BB00BB0',
      '0BB00BB0',
    ],
    colors: {
      B: '#5DADE2', // Blue body
      Y: '#F9E79F', // Yellow belly
      W: '#FFFFFF', // White eyes
    },
  },
  // Eevee - Normal type fox
  {
    name: 'Eevee',
    pattern: [
      'BWWWWWWB',
      'WWWWWWWW',
      'WWBWWBWW',
      'WWWWWWWW',
      'WWWYYYWW',
      '0WWWWW00',
      '00WWWW00',
      '0BWWWB00',
      '0BWWWB00',
      '0BB00BB0',
    ],
    colors: {
      W: '#D4A574', // Brown body
      Y: '#F5DEB3', // Cream chest
      B: '#8B4513', // Dark brown
    },
  },
  // Jigglypuff - Pink balloon Pokémon
  {
    name: 'Jigglypuff',
    pattern: [
      '0BPPPPB0',
      'PPPPPPPP',
      'PWBPPBWP',
      'PPPPPPPP',
      'PPBBBPPP',
      '0PPPPPP0',
      '00PPPP00',
      '00PPPP00',
      '00BPPB00',
      '00B00B00',
    ],
    colors: {
      P: '#FFB6D9', // Pink body
      W: '#87CEEB', // Blue eyes
      B: '#000000', // Black outline
    },
  },
  // Snorlax - Sleeping giant
  {
    name: 'Snorlax',
    pattern: [
      'BBBBBBBB',
      'BTTTTTBB',
      'BTWBTWBB',
      'BTTTTTBB',
      'BTYYYBB0',
      'BTYYYYB0',
      'BTYYYBB0',
      '0BTTBB00',
      '0BTTBB00',
      '0BB00BB0',
    ],
    colors: {
      T: '#3B5A6F', // Teal/dark blue body
      Y: '#F5E6D3', // Cream belly
      B: '#000000', // Black outline
      W: '#FFFFFF', // White eyes
    },
  },
  // Meowth - Cat Pokémon
  {
    name: 'Meowth',
    pattern: [
      'BYYYYB00',
      'YYYYYYYY',
      'YYBYYBYY',
      'YYYYYYYY',
      'YYWWWYY0',
      '0YYYYB00',
      '00YYYY00',
      '0BYYYB00',
      '0BYYYB00',
      '0BB00BB0',
    ],
    colors: {
      Y: '#F4E7C3', // Cream body
      W: '#FFFFFF', // White muzzle
      B: '#8B6914', // Brown outline/coin
    },
  },
];

// Select a Pokémon design based on agent ID hash
function selectPokemon(agentId: string): PokemonDesign {
  const hash = hashString(agentId);
  const index = hash % POKEMON_DESIGNS.length;
  return POKEMON_DESIGNS[index];
}

export default function PixelAvatar({ agentId, agentName }: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Select Pokémon design for this agent
    const pokemon = selectPokemon(agentId);

    // Get 2D context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas 2D context not available');
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw 8×10 pixel grid using Pokémon pattern
    pokemon.pattern.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        
        // '0' represents transparent/empty pixel
        if (char === '0') continue;
        
        // Get color for this character
        const color = pokemon.colors[char];
        if (!color) {
          console.warn(`No color mapping found for character: ${char} in ${pokemon.name}`);
          continue;
        }
        
        // Draw single pixel
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }, [agentId]);

  return (
    <canvas 
      ref={canvasRef}
      className="office-pixel-art"
      width={8}
      height={10}
      aria-label={`Avatar for ${agentName}`}
    />
  );
}

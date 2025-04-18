import { Ship } from '../interfaces/SpacewarInterfaces';
import { normalizeAngle } from './spacewarUtils';

interface CpuAIState {
  cpuTargetPosition: { x: number; y: number };
  isOrbiting: boolean;
  orbitDirection: number;
  cpuDecisionTimer: number;
}

export const updateCpuAI = (
  cpu: Ship,
  player: Ship,
  canvasWidth: number,
  canvasHeight: number,
  sunRadius: number,
  aiState: CpuAIState,
  difficulty: number
): {
  updatedCpu: Ship;
  aiState: CpuAIState;
} => {
  const updatedCpu = { ...cpu };
  const updatedAiState = { ...aiState };
  
  // Update decision timer
  updatedAiState.cpuDecisionTimer++;
  
  // Calculate distance to sun
  const cpuToSun = {
    x: canvasWidth / 2 - cpu.x,
    y: canvasHeight / 2 - cpu.y
  };
  const cpuDistanceToSun = Math.sqrt(cpuToSun.x * cpuToSun.x + cpuToSun.y * cpuToSun.y);
  
  // Define a safer radius from the sun (increased by factor of 2)
  const sunSafeRadius = sunRadius * 6; // Increased from 3 to 6
  
  // Immediate sun avoidance logic - higher priority than anything else
  if (cpuDistanceToSun < sunSafeRadius) {
    // Escape sun's gravity well urgently
    const angleToSun = Math.atan2(cpuToSun.y, cpuToSun.x);
    const escapeAngle = angleToSun + Math.PI; // Direct away from sun
    
    // Set target far from sun
    updatedAiState.cpuTargetPosition = { 
      x: canvasWidth / 2 + Math.cos(escapeAngle) * (sunSafeRadius * 2),
      y: canvasHeight / 2 + Math.sin(escapeAngle) * (sunSafeRadius * 2)
    };
    
    // Force CPU to prioritize sun avoidance
    const angleToTarget = Math.atan2(
      updatedAiState.cpuTargetPosition.y - cpu.y,
      updatedAiState.cpuTargetPosition.x - cpu.x
    );
    
    const angleToTurn = normalizeAngle(angleToTarget - updatedCpu.rotation);
    updatedCpu.rotateLeft = angleToTurn < -0.03;
    updatedCpu.rotateRight = angleToTurn > 0.03;
    updatedCpu.thrust = Math.abs(angleToTurn) < 0.7;
  } else {
    // Regular targeting and combat logic
    const distanceToPlayer = Math.sqrt(
      Math.pow(player.x - cpu.x, 2) + Math.pow(player.y - cpu.y, 2)
    );

    // Calculate angle to player for targeting
    const angleToPlayer = Math.atan2(
      player.y - cpu.y,
      player.x - cpu.x
    );

    // More aggressive pursuit and targeting
    const angleToTurn = normalizeAngle(angleToPlayer - updatedCpu.rotation);
    
    // Tighter rotation control for better targeting
    updatedCpu.rotateLeft = angleToTurn < -0.05;
    updatedCpu.rotateRight = angleToTurn > 0.05;
    
    // Maintain optimal combat distance
    const optimalDistance = 150;
    updatedCpu.thrust = distanceToPlayer > optimalDistance + 20;
    
    // Set target position for movement
    updatedAiState.cpuTargetPosition = {
      x: player.x + player.velocity.x * 2,
      y: player.y + player.velocity.y * 2
    };
  }
  
  return { updatedCpu, aiState: updatedAiState };
};

export const createInitialAIState = (): CpuAIState => {
  return {
    cpuTargetPosition: { x: 0, y: 0 },
    isOrbiting: false,
    orbitDirection: 1, // 1 clockwise, -1 counterclockwise
    cpuDecisionTimer: 0
  };
};

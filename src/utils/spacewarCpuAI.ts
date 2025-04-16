
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
  
  // Update target position and strategy every 2 seconds
  if (updatedAiState.cpuDecisionTimer >= 120) {
    updatedAiState.cpuDecisionTimer = 0;
    
    // Calculate distance to sun
    const cpuToSun = {
      x: canvasWidth / 2 - cpu.x,
      y: canvasHeight / 2 - cpu.y
    };
    const cpuDistanceToSun = Math.sqrt(cpuToSun.x * cpuToSun.x + cpuToSun.y * cpuToSun.y);
    
    // Calculate distance to player
    const distanceToPlayer = Math.sqrt(
      Math.pow(player.x - cpu.x, 2) + Math.pow(player.y - cpu.y, 2)
    );
    
    // Get the angle between CPU and sun
    const cpuAngleToSun = Math.atan2(cpuToSun.y, cpuToSun.x);
    
    // Player to sun calculations
    const playerToSun = {
      x: canvasWidth / 2 - player.x,
      y: canvasHeight / 2 - player.y
    };
    const playerAngleToSun = Math.atan2(playerToSun.y, playerToSun.x);
    const angleDiff = normalizeAngle(playerAngleToSun - cpuAngleToSun);
    
    // Change orbit direction occasionally to be unpredictable
    if (Math.random() < 0.1) {
      updatedAiState.orbitDirection = -updatedAiState.orbitDirection;
    }
    
    // Decide the ideal orbit distance
    const idealOrbitDistance = 120 + Math.random() * 30;
    
    // Determine if we should be orbiting or attacking
    if (distanceToPlayer > 300 || Math.abs(angleDiff) > 1.0) {
      updatedAiState.isOrbiting = true;
      
      // Calculate the target point along the orbit
      const orbitOffset = 0.3 * updatedAiState.orbitDirection; // How far to move along orbit
      const targetOrbitAngle = cpuAngleToSun + orbitOffset;
      
      updatedAiState.cpuTargetPosition = {
        x: canvasWidth/2 + Math.cos(targetOrbitAngle) * idealOrbitDistance,
        y: canvasHeight/2 + Math.sin(targetOrbitAngle) * idealOrbitDistance
      };
    } else {
      // We have a good attacking position, stop orbiting and go for the player
      updatedAiState.isOrbiting = false;
      
      // Predict player's future position for interception
      const predictionFactor = 2.0 + difficulty * 0.8;
      updatedAiState.cpuTargetPosition = {
        x: player.x + player.velocity.x * predictionFactor,
        y: player.y + player.velocity.y * predictionFactor
      };
      
      // If we're too close to the player, maintain some distance
      if (distanceToPlayer < 100) {
        const angleToPlayer = Math.atan2(player.y - cpu.y, player.x - cpu.x);
        const retreatAngle = angleToPlayer + Math.PI;
        const retreatDistance = 150;
        updatedAiState.cpuTargetPosition = {
          x: cpu.x + Math.cos(retreatAngle) * retreatDistance,
          y: cpu.y + Math.sin(retreatAngle) * retreatDistance
        };
      }
    }
  }
  
  // Sun avoidance - enhanced to handle closer approaches more carefully
  const cpuToSun = {
    x: canvasWidth / 2 - cpu.x,
    y: canvasHeight / 2 - cpu.y
  };
  const cpuDistanceToSun = Math.sqrt(cpuToSun.x * cpuToSun.x + cpuToSun.y * cpuToSun.y);
  
  if (cpuDistanceToSun < 60 && !updatedAiState.isOrbiting) {
    // Escape sun's gravity well if too close and not intentionally orbiting
    const angleToSun = Math.atan2(cpuToSun.y, cpuToSun.x);
    const escapeAngle = angleToSun + Math.PI / 2; // Tangential to orbit
    
    const sunAvoidanceX = canvasWidth / 2 + Math.cos(escapeAngle) * 150;
    const sunAvoidanceY = canvasHeight / 2 + Math.sin(escapeAngle) * 150;
    
    updatedAiState.cpuTargetPosition = { x: sunAvoidanceX, y: sunAvoidanceY };
  }
  
  // Calculate thrust and rotation to reach target
  const angleToTarget = Math.atan2(
    updatedAiState.cpuTargetPosition.y - cpu.y,
    updatedAiState.cpuTargetPosition.x - cpu.x
  );
  
  const angleToTurn = normalizeAngle(angleToTarget - updatedCpu.rotation);
  
  // Smart rotation control - more responsive at higher difficulty
  const turnAngleThreshold = 0.1 / (1 + difficulty * 0.2);
  updatedCpu.rotateLeft = angleToTurn < -turnAngleThreshold;
  updatedCpu.rotateRight = angleToTurn > turnAngleThreshold;
  
  // Smart thrust control - thrust when pointed approximately at target
  const thrustAngleThreshold = 0.3 / (1 + difficulty * 0.1);
  updatedCpu.thrust = Math.abs(angleToTurn) < thrustAngleThreshold;
  
  // If we're orbiting, adjust thrust to maintain the right orbit distance
  if (updatedAiState.isOrbiting) {
    const idealOrbitDistance = 120;
    const orbitDifferential = Math.abs(cpuDistanceToSun - idealOrbitDistance);
    
    // If we're at approximately the right distance, don't thrust too much
    if (orbitDifferential < 20) {
      updatedCpu.thrust = updatedCpu.thrust && Math.random() < 0.7;
    }
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

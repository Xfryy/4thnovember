import { SCENE_REGISTRY } from "./acts";
import { Scene } from "@/types/game";

/**
 * Traverses the scene graph from a starting scene ID up to a certain depth
 * using a breadth-first search (BFS) approach.
 * @param startSceneId The ID of the scene to start traversal from.
 * @param depth The maximum number of scenes to traverse from the start.
 * @returns An array of unique Scene objects reachable from the start.
 */
export function getReachableScenes(startSceneId: string, depth: number): Scene[] {
  const visited = new Set<string>();
  const reachable = new Map<string, Scene>();
  const queue: [string, number][] = [[startSceneId, 0]];

  while (queue.length > 0) {
    const [currentId, currentDepth] = queue.shift()!;

    if (!currentId || visited.has(currentId)) {
      continue;
    }

    const scene = SCENE_REGISTRY[currentId];
    if (!scene) {
      continue;
    }

    visited.add(currentId);
    reachable.set(currentId, scene);

    if (currentDepth >= depth) {
      continue;
    }

    const nextScenes: string[] = [];
    if (scene.next) {
      nextScenes.push(scene.next);
    }
    if (scene.type === 'choice' && scene.options) {
      scene.options.forEach(opt => {
        if (opt.next) nextScenes.push(opt.next);
      });
    }

    for (const nextId of nextScenes) {
      if (!visited.has(nextId)) {
        queue.push([nextId, currentDepth + 1]);
      }
    }
  }

  return Array.from(reachable.values());
}

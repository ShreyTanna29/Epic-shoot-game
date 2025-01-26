import { useGameStore } from "../store/store";

export default function endGame() {
  const store = useGameStore.getState();
  const { animationId, setGameStarted } = store;
  cancelAnimationFrame(animationId);
  setGameStarted(false);
}

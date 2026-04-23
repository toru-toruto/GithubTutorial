import type { Phase } from "../data/phases";
import "./Board.css";

interface BoardProps {
  phases: Phase[];
  selectedPhaseId: number | null;
  onSelectPhase: (id: number) => void;
}

export default function Board({
  phases,
  selectedPhaseId,
  onSelectPhase,
}: BoardProps) {
  return (
    <div className="board">
      <div className="board-track">
        {phases.map((phase, index) => (
          <div key={phase.id} className="board-cell">
            {index > 0 && (
              <div className="connector">
                <svg viewBox="0 0 40 12" className="connector-arrow">
                  <line
                    x1="0"
                    y1="6"
                    x2="32"
                    y2="6"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <polygon points="30,2 38,6 30,10" fill="#cbd5e1" />
                </svg>
              </div>
            )}
            <button
              className={`node ${selectedPhaseId === phase.id ? "node--selected" : ""}`}
              style={
                {
                  "--node-color": phase.color,
                } as React.CSSProperties
              }
              onClick={() => onSelectPhase(phase.id)}
            >
              <span className="node-icon">{phase.icon}</span>
              <span className="node-step">STEP {phase.id}</span>
              <span className="node-label">{phase.label}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="board-loop-hint">
        <svg viewBox="0 0 200 30" className="loop-arrow">
          <path
            d="M180,5 Q195,5 195,15 Q195,25 180,25 L20,25 Q5,25 5,15 Q5,5 20,5"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <polygon points="22,1 14,5 22,9" fill="#94a3b8" />
        </svg>
        <span className="loop-text">繰り返し</span>
      </div>
    </div>
  );
}

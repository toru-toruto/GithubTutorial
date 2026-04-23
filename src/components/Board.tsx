import { useRef, useEffect, useState, useCallback } from "react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [loopStyle, setLoopStyle] = useState<React.CSSProperties>({});

  const updateLoop = useCallback(() => {
    const track = trackRef.current;
    const step2 = nodeRefs.current[1]; // STEP 2 (index 1)
    const step10 = nodeRefs.current[9]; // STEP 10 (index 9)
    if (!track || !step2 || !step10) return;

    const trackRect = track.getBoundingClientRect();
    const step2Rect = step2.getBoundingClientRect();
    const step10Rect = step10.getBoundingClientRect();

    const left = step2Rect.left + step2Rect.width / 2 - trackRect.left;
    const right = step10Rect.left + step10Rect.width / 2 - trackRect.left;

    setLoopStyle({
      left: `${left}px`,
      width: `${right - left}px`,
    });
  }, []);

  useEffect(() => {
    updateLoop();
    window.addEventListener("resize", updateLoop);
    return () => window.removeEventListener("resize", updateLoop);
  }, [updateLoop]);

  return (
    <div className="board">
      <div className="board-track" ref={trackRef}>
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
              ref={(el) => { nodeRefs.current[index] = el; }}
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

        {/* Loop arrow: positioned absolutely from STEP 10 center back to STEP 2 center */}
        <div className="board-loop-hint" style={loopStyle}>
          <svg
            viewBox="0 0 200 36"
            className="loop-arrow"
            preserveAspectRatio="none"
          >
            {/* right side: down from top */}
            <path
              d="M196,0 L196,12 Q196,28 182,28 L18,28 Q4,28 4,12 L4,0"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {/* arrowhead pointing up at left end (STEP 2) */}
            <polygon points="0,6 4,0 8,6" fill="#94a3b8" />
          </svg>
          <span className="loop-text">繰り返し</span>
        </div>
      </div>
    </div>
  );
}

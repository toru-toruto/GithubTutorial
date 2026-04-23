import type { Phase } from "../data/phases";
import "./CommandPanel.css";

interface CommandPanelProps {
  phase: Phase | null;
  branchName: string;
}

export default function CommandPanel({ phase, branchName }: CommandPanelProps) {
  if (!phase) {
    return (
      <div className="panel panel--empty">
        <div className="panel-placeholder">
          <span className="panel-placeholder-icon">👆</span>
          <p>上のノードをクリックしてコマンドを表示</p>
        </div>
      </div>
    );
  }

  const commands = phase.commands(branchName || "feature/my-branch");

  return (
    <div className="panel" style={{ "--panel-accent": phase.color } as React.CSSProperties}>
      <div className="panel-header">
        <span className="panel-icon">{phase.icon}</span>
        <div>
          <span className="panel-step">STEP {phase.id}</span>
          <h2 className="panel-title">{phase.label}</h2>
        </div>
      </div>

      <div className="panel-body">
        <div className="panel-commands">
          <h3>コマンド</h3>
          <div className="command-list">
            {commands.map((cmd, i) => (
              <div
                key={i}
                className={`command-line ${cmd.startsWith("#") ? "command-comment" : ""}`}
              >
                {!cmd.startsWith("#") && <span className="prompt">$</span>}
                <code>{cmd}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-description">
          <h3>解説</h3>
          <p>{phase.description}</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { phases } from "./data/phases";
import Board from "./components/Board";
import CommandPanel from "./components/CommandPanel";
import "./App.css";

function App() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const [branchName, setBranchName] = useState("feature/add-login");

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId) ?? null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Git チーム開発 すごろく</h1>
        <p className="subtitle">
          ノードをクリックして、各フェーズのコマンドを確認しよう
        </p>
        <div className="branch-input-wrapper">
          <label htmlFor="branch-name">
            <span className="branch-icon">🌿</span>
            ブランチ名:
          </label>
          <input
            id="branch-name"
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="feature/your-branch"
          />
        </div>
      </header>

      <Board
        phases={phases}
        selectedPhaseId={selectedPhaseId}
        onSelectPhase={setSelectedPhaseId}
      />

      <CommandPanel phase={selectedPhase} branchName={branchName} />
    </div>
  );
}

export default App;

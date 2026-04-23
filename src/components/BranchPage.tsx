import { useState, useCallback } from "react";
import "./BranchPage.css";

interface Commit {
  id: string;
  branch: string;
  parentIds: string[];
  order: number;
}

const BRANCH_COLORS = [
  "#4CAF50", "#2196F3", "#FF9800", "#9C27B0",
  "#f44336", "#00BCD4", "#FF5722", "#607D8B",
  "#E91E63", "#3F51B5", "#CDDC39", "#795548",
];

const ADJECTIVES = [
  "awesome", "cool", "fast", "smart", "shiny",
  "happy", "brave", "calm", "bold", "swift",
];
const NOUNS = [
  "login", "button", "header", "search", "modal",
  "sidebar", "navbar", "footer", "avatar", "toast",
];
const PREFIXES = ["feature", "fix", "hotfix"];

function randomBranchName(existing: string[]): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const name = `${prefix}/${adj}-${noun}`;
    if (!existing.includes(name)) return name;
  }
  return `feature/branch-${Date.now()}`;
}

let _nextId = 1;
function genId(): string {
  return `c${_nextId++}`;
}

const NODE_R = 14;
const X_SPACING = 72;
const Y_SPACING = 56;
const PAD_LEFT = 180;
const PAD_TOP = 36;
const PAD_RIGHT = 48;
const PAD_BOTTOM = 36;

export default function BranchPage() {
  const [commits, setCommits] = useState<Commit[]>([
    { id: "c0", branch: "main", parentIds: [], order: 0 },
  ]);
  const [branches, setBranches] = useState<string[]>(["main"]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mergeMode, setMergeMode] = useState(false);
  const [nextOrder, setNextOrder] = useState(1);

  const selected = commits.find((c) => c.id === selectedId) ?? null;

  const colorOf = (branch: string) =>
    BRANCH_COLORS[branches.indexOf(branch) % BRANCH_COLORS.length];

  const latestOn = useCallback(
    (branch: string) => {
      const bc = commits.filter((c) => c.branch === branch);
      return bc.length > 0 ? bc[bc.length - 1] : null;
    },
    [commits],
  );

  const pos = (c: Commit) => ({
    x: PAD_LEFT + c.order * X_SPACING,
    y: PAD_TOP + branches.indexOf(c.branch) * Y_SPACING,
  });

  /* --- actions --- */
  const handleBranch = () => {
    if (!selected) return;
    const name = randomBranchName(branches);
    const nc: Commit = {
      id: genId(),
      branch: name,
      parentIds: [selected.id],
      order: nextOrder,
    };
    setBranches((b) => [...b, name]);
    setCommits((c) => [...c, nc]);
    setNextOrder((n) => n + 1);
    setSelectedId(nc.id);
    setMergeMode(false);
  };

  const handleCommit = () => {
    if (!selected) return;
    const latest = latestOn(selected.branch);
    if (!latest) return;
    const nc: Commit = {
      id: genId(),
      branch: selected.branch,
      parentIds: [latest.id],
      order: nextOrder,
    };
    setCommits((c) => [...c, nc]);
    setNextOrder((n) => n + 1);
    setSelectedId(nc.id);
    setMergeMode(false);
  };

  const handleMerge = (sourceBranch: string) => {
    if (!selected) return;
    const targetLatest = latestOn(selected.branch);
    const sourceLatest = latestOn(sourceBranch);
    if (!targetLatest || !sourceLatest) return;
    const mc: Commit = {
      id: genId(),
      branch: selected.branch,
      parentIds: [targetLatest.id, sourceLatest.id],
      order: nextOrder,
    };
    setCommits((c) => [...c, mc]);
    setNextOrder((n) => n + 1);
    setMergeMode(false);
    setSelectedId(mc.id);
  };

  const handleReset = () => {
    _nextId = 1;
    setCommits([{ id: "c0", branch: "main", parentIds: [], order: 0 }]);
    setBranches(["main"]);
    setSelectedId(null);
    setMergeMode(false);
    setNextOrder(1);
  };

  /* --- layout --- */
  const maxOrder = Math.max(...commits.map((c) => c.order));
  const svgW = Math.max(PAD_LEFT + maxOrder * X_SPACING + PAD_RIGHT, 400);
  const svgH = Math.max(
    PAD_TOP + (branches.length - 1) * Y_SPACING + PAD_BOTTOM,
    100,
  );

  /* edges */
  const edges: { from: Commit; to: Commit; isMerge: boolean }[] = [];
  for (const c of commits) {
    for (let i = 0; i < c.parentIds.length; i++) {
      const parent = commits.find((p) => p.id === c.parentIds[i]);
      if (parent) edges.push({ from: parent, to: c, isMerge: i > 0 });
    }
  }

  const mergeCandidates = selected
    ? branches.filter((b) => b !== selected.branch)
    : [];

  return (
    <div className="bp">
      <header className="bp-header">
        <h1>ブランチ ビジュアライザー</h1>
        <p className="bp-subtitle">
          ノードをクリックして、ブランチの作成やマージを体験しよう
        </p>
      </header>

      {/* toolbar */}
      <div className="bp-toolbar">
        <button
          className="bp-btn bp-btn--branch"
          disabled={!selected}
          onClick={handleBranch}
        >
          <span className="bp-btn-icon">🌿</span>
          ブランチを切る
        </button>
        <button
          className="bp-btn bp-btn--commit"
          disabled={!selected}
          onClick={handleCommit}
        >
          <span className="bp-btn-icon">💾</span>
          コミットを追加
        </button>
        <button
          className="bp-btn bp-btn--merge"
          disabled={!selected || mergeCandidates.length === 0}
          onClick={() => setMergeMode((m) => !m)}
        >
          <span className="bp-btn-icon">🔀</span>
          マージ
        </button>
        <button className="bp-btn bp-btn--reset" onClick={handleReset}>
          <span className="bp-btn-icon">🗑️</span>
          リセット
        </button>
      </div>

      {/* merge picker */}
      {mergeMode && selected && (
        <div className="bp-merge-picker">
          <span className="bp-merge-label">
            「{selected.branch}」にマージするブランチを選択:
          </span>
          <div className="bp-merge-options">
            {mergeCandidates.map((b) => (
              <button
                key={b}
                className="bp-merge-opt"
                style={
                  { "--merge-color": colorOf(b) } as React.CSSProperties
                }
                onClick={() => handleMerge(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* graph */}
      <div className="bp-graph-wrap">
        <svg
          className="bp-graph"
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
        >
          {/* branch lane backgrounds */}
          {branches.map((branch, i) => {
            const bc = commits
              .filter((c) => c.branch === branch)
              .sort((a, b) => a.order - b.order);
            if (bc.length === 0) return null;
            const y = PAD_TOP + i * Y_SPACING;
            const x1 = PAD_LEFT + bc[0].order * X_SPACING;
            const x2 = PAD_LEFT + bc[bc.length - 1].order * X_SPACING;
            return (
              <line
                key={`lane-${branch}`}
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={colorOf(branch)}
                strokeWidth="3"
                strokeOpacity="0.2"
              />
            );
          })}

          {/* branch labels */}
          {branches.map((branch, i) => (
            <text
              key={`label-${branch}`}
              x={PAD_LEFT - 16}
              y={PAD_TOP + i * Y_SPACING + 5}
              textAnchor="end"
              className="bp-branch-label"
              fill={colorOf(branch)}
            >
              {branch}
            </text>
          ))}

          {/* edges */}
          {edges.map(({ from, to, isMerge }, i) => {
            const fp = pos(from);
            const tp = pos(to);
            if (fp.y === tp.y) {
              return (
                <line
                  key={`e${i}`}
                  x1={fp.x}
                  y1={fp.y}
                  x2={tp.x}
                  y2={tp.y}
                  stroke={colorOf(to.branch)}
                  strokeWidth="3"
                />
              );
            }
            const dx = tp.x - fp.x;
            const d = `M${fp.x},${fp.y} C${fp.x + dx * 0.4},${fp.y} ${tp.x - dx * 0.4},${tp.y} ${tp.x},${tp.y}`;
            return (
              <path
                key={`e${i}`}
                d={d}
                fill="none"
                stroke={isMerge ? colorOf(to.branch) : colorOf(to.branch)}
                strokeWidth="2.5"
                strokeDasharray={isMerge ? "6 3" : "none"}
              />
            );
          })}

          {/* commit nodes */}
          {commits.map((c) => {
            const p = pos(c);
            const isSel = c.id === selectedId;
            const isMergeCommit = c.parentIds.length > 1;
            return (
              <g
                key={c.id}
                className="bp-node-g"
                onClick={() => {
                  setSelectedId(c.id);
                  setMergeMode(false);
                }}
              >
                {isSel && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={NODE_R + 7}
                    fill="none"
                    stroke={colorOf(c.branch)}
                    strokeWidth="3"
                    opacity="0.35"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={NODE_R}
                  className={`bp-node ${isSel ? "bp-node--sel" : ""}`}
                  style={
                    {
                      "--n-color": colorOf(c.branch),
                      fill: isSel ? colorOf(c.branch) : undefined,
                    } as React.CSSProperties
                  }
                  stroke={colorOf(c.branch)}
                  strokeWidth="3"
                />
                {isMergeCommit && (
                  <text
                    x={p.x}
                    y={p.y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill={isSel ? "#fff" : colorOf(c.branch)}
                    style={{ pointerEvents: "none" }}
                  >
                    M
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* info bar */}
      {selected && (
        <div className="bp-info">
          <span className="bp-info-dot" style={{ background: colorOf(selected.branch) }} />
          <span className="bp-info-branch">{selected.branch}</span>
          <span className="bp-info-id">{selected.id}</span>
          {selected.parentIds.length > 1 && (
            <span className="bp-info-badge">マージコミット</span>
          )}
        </div>
      )}

      {!selected && (
        <div className="bp-info bp-info--empty">
          <span>👆 コミットノードをクリックして選択してください</span>
        </div>
      )}
    </div>
  );
}

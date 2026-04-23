export interface Phase {
  id: number;
  label: string;
  icon: string;
  color: string;
  commands: (branchName: string) => string[];
  description: string;
}

export const phases: Phase[] = [
  {
    id: 1,
    label: "Clone",
    icon: "📥",
    color: "#4CAF50",
    commands: () => [
      "git clone https://github.com/<org>/<repo>.git",
      "cd <repo>",
    ],
    description:
      "リモートリポジトリをローカルにコピーします。チーム開発の最初のステップです。clone後はcdでプロジェクトディレクトリに移動しましょう。",
  },
  {
    id: 2,
    label: "ブランチ作成",
    icon: "🌿",
    color: "#8BC34A",
    commands: (branch) => [
      `git switch -c ${branch}`,
    ],
    description:
      "作業用のブランチを作成して切り替えます。mainブランチで直接作業せず、必ずfeatureブランチを切りましょう。ブランチ名は「feature/機能名」のように命名するのが一般的です。",
  },
  {
    id: 3,
    label: "コード変更",
    icon: "✏️",
    color: "#FF9800",
    commands: () => [
      "# ファイルを編集する",
      "git status",
      "git diff",
    ],
    description:
      "ファイルを編集して変更を加えます。git statusで変更状況を確認し、git diffで差分を確認できます。こまめにstatusを確認する癖をつけましょう。",
  },
  {
    id: 4,
    label: "Commit",
    icon: "💾",
    color: "#FF5722",
    commands: (branch) => [
      "git add .",
      `git commit -m "${branch}: 変更内容の説明"`,
    ],
    description:
      "変更をステージングしてコミットします。git addで変更をステージに上げ、git commitでスナップショットを保存します。コミットメッセージはわかりやすく書きましょう。",
  },
  {
    id: 5,
    label: "Push",
    icon: "🚀",
    color: "#2196F3",
    commands: (branch) => [
      `git push origin ${branch}`,
    ],
    description:
      "ローカルの変更をリモートリポジトリに反映します。初回pushでリモートにブランチが作成されます。pushすることでチームメンバーがあなたの変更を見られるようになります。",
  },
  {
    id: 6,
    label: "PR作成",
    icon: "📝",
    color: "#9C27B0",
    commands: (branch) => [
      `# GitHub上で「${branch}」→「main」へのPRを作成`,
      "# タイトルと説明を記入",
      "# レビュアーをアサイン",
    ],
    description:
      "Pull Requestを作成してコードレビューを依頼します。変更の目的・内容を説明し、レビュアーをアサインしましょう。PRはチーム開発におけるコミュニケーションの場です。",
  },
  {
    id: 7,
    label: "コンフリクト!?",
    icon: "⚠️",
    color: "#f44336",
    commands: (branch) => [
      "git switch main",
      "git pull origin main",
      `git switch ${branch}`,
      "git merge main",
      "# コンフリクトを手動で解決",
      "git add .",
      `git commit -m "Merge main into ${branch}"`,
      `git push origin ${branch}`,
    ],
    description:
      "他の人の変更と衝突が発生することがあります。まずmainを最新にし、自分のブランチにmergeして、手動で競合箇所を解決します。<<<< ==== >>>>のマーカーを探して正しいコードに修正しましょう。",
  },
  {
    id: 8,
    label: "レビュー & Merge",
    icon: "✅",
    color: "#00BCD4",
    commands: () => [
      "# GitHub上でレビューコメントを確認",
      "# 必要なら修正してpush",
      "# Approveされたら「Merge」ボタンをクリック",
    ],
    description:
      "レビュアーがコードをチェックし、Approveされたらmainブランチにマージします。Squash MergeやRebase Mergeなどマージ戦略はチームで統一しましょう。",
  },
  {
    id: 9,
    label: "mainをPull",
    icon: "🔄",
    color: "#009688",
    commands: () => [
      "git switch main",
      "git pull origin main",
    ],
    description:
      "マージ後、ローカルのmainを最新に更新します。次の作業を始める前に必ずpullして、最新のコードベースから作業を開始しましょう。",
  },
  {
    id: 10,
    label: "次のブランチへ!",
    icon: "🔁",
    color: "#607D8B",
    commands: (branch) => [
      `git switch -c ${branch}-v2`,
      "# 新しい作業を開始!",
    ],
    description:
      "また新しいfeatureブランチを作って開発サイクルを繰り返します。この一連の流れがチーム開発の基本ループです。繰り返すうちに自然と身につきます!",
  },
];

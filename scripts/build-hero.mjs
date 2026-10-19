// プロフィール用ターミナル画像を生成する。実行: node scripts/build-hero.mjs
// 経歴は README の文章と同じ内容を保つこと（画像内の文字は検索・翻訳されない）
import { writeFileSync } from "node:fs";

const W = 840;
const LINE = 25;
const TOP = 74;
const FONT = `ui-monospace, "SF Mono", Menlo, Consolas, "Hiragino Sans", "Noto Sans CJK JP", monospace`;

const themes = {
  dark: { bg: "#0d1117", bar: "#161b22", border: "#30363d", fg: "#e6edf3", dim: "#7d8590", prompt: "#56d364", path: "#79c0ff", role: "#e3b341", dot: "#30363d" },
  light: { bg: "#ffffff", bar: "#f6f8fa", border: "#d0d7de", fg: "#1f2328", dim: "#656d76", prompt: "#1a7f37", path: "#0969da", role: "#9a6700", dot: "#d0d7de" },
};

const career = [
  ["2009", "グリー", "執行役員 VPoE"],
  ["2015", "LITALICO", "執行役員 CTO"],
  ["2019", "ウェルスナビ", "執行役員 CPO"],
  ["2020", "SmartDrive", "CTO"],
  ["2020", "エブリー", "執行役員 カンパニー長"],
  ["2023", "社外CTO・技術顧問", "AI活用の開発支援"],
  ["2025", "ブーストコンサルティング", "技術フェロー"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function build(t) {
  const out = [];
  let row = 0;
  const y = () => TOP + row * LINE;
  const text = (x, cls, s) => out.push(`<text x="${x}" y="${y()}" class="${cls}">${esc(s)}</text>`);
  const prompt = (cmd) => {
    text(32, "p", "takish@github");
    text(150, "a", "~");
    text(172, "f", `% ${cmd}`);
    row++;
  };

  prompt("whoami");
  text(32, "f", "Takashi Kishida");
  text(190, "d", "CTO / CPO  ·  博士（情報工学）");
  row += 2;

  prompt("cat career.log");
  for (const [year, co, role] of career) {
    text(32, "d", year);
    text(88, "f", co);
    text(318, "r", role);
    row++;
  }
  row++;

  prompt("meequs --status");
  text(32, "f", "代表1名 + AIエージェントのチームで、40以上のプロダクトを開発・公開中");
  row += 2;

  text(32, "p", "takish@github");
  text(150, "a", "~");
  text(172, "f", "%");
  const cy = y();
  out.push(`<rect x="191" y="${cy - 14}" width="9" height="17" class="cur"/>`);

  const H = cy + 36;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="takish のプロフィール: Takashi Kishida、CTO / CPO。グリー、LITALICO、ウェルスナビ、SmartDrive、エブリーを経て、現在は社外CTO・技術顧問。">
<style>
text{font-family:${FONT};font-size:14px;white-space:pre}
.f{fill:${t.fg}}.d{fill:${t.dim}}.p{fill:${t.prompt}}.a{fill:${t.path}}.r{fill:${t.role}}
.cur{fill:${t.fg};animation:blink 1.1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.cur{animation:none}}
</style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.bg}" stroke="${t.border}"/>
<path d="M0.5 10.5a10 10 0 0 1 10-10h${W - 21}a10 10 0 0 1 10 10V38H0.5z" fill="${t.bar}"/>
<line x1="0.5" y1="38.5" x2="${W - 0.5}" y2="38.5" stroke="${t.border}"/>
<circle cx="22" cy="20" r="5.5" fill="${t.dot}"/><circle cx="42" cy="20" r="5.5" fill="${t.dot}"/><circle cx="62" cy="20" r="5.5" fill="${t.dot}"/>
<text x="${W / 2}" y="24" text-anchor="middle" class="d" style="font-size:12px">takish — zsh</text>
${out.join("\n")}
</svg>
`;
}

for (const [name, t] of Object.entries(themes)) {
  writeFileSync(new URL(`../assets/hero-${name}.svg`, import.meta.url), build(t));
}
console.log("wrote assets/hero-{dark,light}.svg");

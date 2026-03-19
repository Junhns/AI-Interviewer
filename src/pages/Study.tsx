import { useState } from "react";

type Complexity = {
  operation: string;
  time: string;
  note?: string;
};

type DataStructure = {
  id: string;
  name: string;
  tagline: string;
  whenToUse: string[];
  signals: string[];
  complexities: Complexity[];
  example: string;
  problems: { name: string; difficulty: "easy" | "medium" | "hard" }[];
};

const structures: DataStructure[] = [
  {
    id: "hashmap",
    name: "HashMap",
    tagline: "Key-value lookup in O(1) — your most used tool",
    whenToUse: [
      "You need to count frequency of elements",
      "You need to find if something exists quickly",
      "You need to store and retrieve values by a key",
      "The problem involves finding pairs or complements",
    ],
    signals: [
      '"Find two numbers that sum to X"',
      '"Count occurrences of..."',
      '"Find duplicates"',
      '"Group elements by..."',
      '"Check if X exists in collection"',
    ],
    complexities: [
      { operation: "Insert", time: "O(1)" },
      { operation: "Delete", time: "O(1)" },
      { operation: "Lookup", time: "O(1)" },
      { operation: "Search", time: "O(n)", note: "worst case" },
    ],
    example: `// Two Sum — classic HashMap problem
Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (map.containsKey(complement)) {
        return new int[]{map.get(complement), i};
    }
    map.put(nums[i], i);
}`,
    problems: [
      { name: "Two Sum", difficulty: "easy" },
      { name: "Valid Anagram", difficulty: "easy" },
      { name: "Group Anagrams", difficulty: "medium" },
      { name: "Top K Frequent Elements", difficulty: "medium" },
    ],
  },
];

const difficultyColor = {
  easy: "#22d3a0",
  medium: "#ffd166",
  hard: "#e63946",
};

export default function Study() {
  const [selected, setSelected] = useState<DataStructure>(structures[0]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      display: "flex",
      fontFamily: "'JetBrains Mono', monospace",
      color: "#e2eaf8",
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220,
        borderRight: "1px solid #1a2a45",
        padding: "24px 0",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        <div style={{ padding: "0 16px 16px", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a7299" }}>
          Data Structures
        </div>
        {structures.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s)}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: selected.id === s.id ? "#0d1420" : "transparent",
              border: "none",
              borderLeft: selected.id === s.id ? "2px solid #3b82f6" : "2px solid transparent",
              color: selected.id === s.id ? "#e2eaf8" : "#5a7299",
              fontFamily: "monospace",
              fontSize: "0.8rem",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto", maxWidth: 800 }}>
        <div style={{ marginBottom: 36, borderLeft: "2px solid #3b82f6", paddingLeft: 20 }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>
            {selected.name}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#5a7299", lineHeight: 1.6 }}>
            {selected.tagline}
          </p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a7299", marginBottom: 12 }}>
            When to use
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.whenToUse.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#3b82f6", flexShrink: 0 }}>→</span>
                <span style={{ fontSize: "0.85rem", color: "#8ba3c9", lineHeight: 1.6 }}>{w}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a7299", marginBottom: 12 }}>
            Problem signals — look for these phrases
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {selected.signals.map((s, i) => (
              <span key={i} style={{
                padding: "4px 12px",
                background: "#0d1420",
                border: "1px solid #1e3252",
                fontSize: "0.75rem",
                color: "#60a5fa",
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a7299", marginBottom: 12 }}>
            Time Complexity
          </div>
          <div style={{ border: "1px solid #1a2a45" }}>
            {selected.complexities.map((c, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                borderBottom: i < selected.complexities.length - 1 ? "1px solid #1a2a45" : "none",
                background: i % 2 === 0 ? "#0d1420" : "transparent",
              }}>
                <span style={{ fontSize: "0.82rem", color: "#8ba3c9" }}>{c.operation}</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  {c.note && <span style={{ fontSize: "0.7rem", color: "#5a7299" }}>{c.note}</span>}
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#22d3a0", fontFamily: "monospace" }}>{c.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a7299", marginBottom: 12 }}>
            Code Pattern
          </div>
          <pre style={{
            background: "#060a10",
            border: "1px solid #1a2a45",
            borderLeft: "2px solid #3b82f6",
            padding: "20px",
            fontSize: "0.82rem",
            lineHeight: 1.8,
            color: "#22d3a0",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            margin: 0,
          }}>
            {selected.example}
          </pre>
        </div>

        <div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a7299", marginBottom: 12 }}>
            Practice Problems
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {selected.problems.map((p, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "#0d1420",
                border: "1px solid #1a2a45",
              }}>
                <span style={{ fontSize: "0.85rem", color: "#8ba3c9" }}>{p.name}</span>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: difficultyColor[p.difficulty],
                }}>
                  {p.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
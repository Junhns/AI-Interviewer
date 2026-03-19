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
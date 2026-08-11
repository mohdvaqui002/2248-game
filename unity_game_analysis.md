# 2248 Game - Unity Codebase Reference Analysis

This document contains a comparative analysis of the Unity C# implementation of the 2248 Game from the reference repository: `https://github.com/tuandungmnt/2248-Game.git`.

---

## 🔍 Core Logic Differences

| Feature | React Implementation (Ours) | Unity Implementation (Reference) |
| :--- | :--- | :--- |
| **Connection Directions** | Horizontal, Vertical, and **Diagonal** | **Horizontal and Vertical only** (No diagonal connections) |
| **Merge Value Calculation** | `maxValInChain * 2` (Next power of 2 above the highest tile in the chain) | Sum-based: The highest power of 2 less than or equal to the sum of the chain |
| **Grid Dimensions** | 5 cols x 7 rows | 5 cols x 7 rows |
| **Game Over Condition** | No adjacent identical tiles remaining | No adjacent identical tiles remaining |

---

## 🛠️ Unity Logic Deep Dive (`GameMaster.cs`)

### 1. Connection Adjacency Constraint
The Unity implementation limits connections strictly to horizontal and vertical adjacencies using Manhattan distance:
```csharp
bool CheckAdject(int x, int y) {
    Vector2 xx = new Vector2(x / 7, x % 7);
    Vector2 yy = new Vector2(y / 7, y % 7);
    if (Math.Abs(xx.x - yy.x) + Math.Abs(xx.y - yy.y) == 1) return true;
    return false;
}
```

### 2. Merge Progression Math
The final value of the merged block is computed based on the sum of all elements, then rounded down to the nearest power of 2:
```csharp
int sum = 0;
for (int i = 0; i < n; ++i) sum += GetNum(st[i]);

int s = 2;
while (s <= sum) s *= 2; 
s /= 2;
```
For example, a chain of six `2` tiles (sum = 12) merges into an `8` tile.

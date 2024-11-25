---
title: LeetCode刷题笔记(2022-09)
toc_number: true
categories: algorithm
tags:
  - LeetCode
description: 2022-09-01 -> 2022-09-30
comments:
toc:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
katex:
highlight_shrink:
aside:
sticky:
series: LeetCode刷题笔记
---

{% series %}

### [1475] 商品折扣后的最终价格

Time: 2022-09-01

Difficulty: Easy (71.53%)

Tags: Unknown

```java
class Solution {

  /**
   * 103/103 cases passed (1 ms)
   * Your runtime beats 98.71 % of java submissions
   * Your memory usage beats 5.27 % of java submissions (42 MB)
   * @param prices
   * @return
   */
  public int[] finalPrices(int[] prices) {
    var res = prices;
    for (int i = 0; i < prices.length; i++) {
      for (int j = i + 1; j < prices.length; j++) {
        if (prices[j] <= res[i]) {
          res[i] -= prices[j];
          break;
        }
      }
    }
    return res;
  }
}
```

### [946] 验证栈序列

Time: 2022-09-01

Difficulty: Medium (66.45%)

Tags: math | greedy

```java
class Solution {

  /**
   * 151/151 cases passed (2 ms)
   * Your runtime beats 57.83 % of java submissions
   * Your memory usage beats 71.84 % of java submissions (41 MB)
   * @param pushed
   * @param popped
   * @return
   */
  public boolean validateStackSequences(int[] pushed, int[] popped) {
    var pushedList = new ArrayList<Integer>() {
      {
        for (var p : pushed) {
          add(p);
        }
      }
    };
    var pushedPtr = 0;
    var poppedPtr = 0;
    for (;;) {
      if (pushedList.get(pushedPtr) == popped[poppedPtr]) {
        pushedList.remove(pushedPtr);
        pushedPtr = pushedPtr > 0 ? pushedPtr - 1 : 0;
        poppedPtr++;
      } else {
        pushedPtr++;
      }
      if (poppedPtr >= popped.length) {
        return pushedList.size() == 0;
      }
      if (pushedPtr >= pushedList.size()) {
        return false;
      }
    }
  }
}
```

### [687] 最长同值路径

Time: 2022-09-02

Difficulty: Medium (45.39%)

Tags: tree | recursion

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {

  private int max = 0;

  private int dfs(TreeNode node) {
    if (node == null) {
      return 0;
    }
    var leftLength = 0;
    var rightLength = 0;
    if (node.left != null) {
      if (node.left.val == node.val) {
        leftLength = dfs(node.left) + 1;
      } else {
        dfs(node.left);
      }
    }
    if (node.right != null) {
      if (node.right.val == node.val) {
        rightLength = dfs(node.right) + 1;
      } else {
        dfs(node.right);
      }
    }
    max = Math.max(max, leftLength + rightLength);
    return Math.max(leftLength, rightLength);
  }

  /**
   * 71/71 cases passed (2 ms)
   * Your runtime beats 96.54 % of java submissions
   * Your memory usage beats 93.7 % of java submissions (44.6 MB)
   * @param root
   * @return
   */
  public int longestUnivaluePath(TreeNode root) {
    dfs(root);
    return max;
  }
}
```

### [998] 最大二叉树 II

Time: 2022-09-02

Difficulty: Medium (68.79%)

Tags: tree

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {

  private int maxPosOf(List<TreeNode> nodeList) {
    var res = 0;
    for (int i = 0; i < nodeList.size(); i++) {
      if (nodeList.get(i).val > nodeList.get(res).val) {
        res = i;
      }
    }
    return res;
  }

  private List<TreeNode> getA(List<TreeNode> a, int index) {
    if (a.isEmpty()) {
      return null;
    }
    var root = a.get(index);
    if (root.right != null) {
      a.add(index + 1, root.right);
      a = getA(a, index + 1);
    }
    if (root.left != null) {
      a.add(index, root.left);
      a = getA(a, index);
    }
    return a;
  }

  private TreeNode getConstructB(List<TreeNode> toB, int rootPos) {
    var root = toB.get(rootPos);
    var leftList = toB.subList(0, rootPos);
    var rightList = toB.subList(rootPos + 1, toB.size());
    if (!leftList.isEmpty()) {
      root.left = getConstructB(leftList, maxPosOf(leftList));
    }
    if (!rightList.isEmpty()) {
      root.right = getConstructB(rightList, maxPosOf(rightList));
    }
    return root;
  }

  /**
   * 75/75 cases passed (1 ms)
   * Your runtime beats 100 % of java submissions
   * Your memory usage beats 28.15 % of java submissions (39.7 MB)
   * {@summary 暴力解居然这个速度，亏我费劲优化半天}
   * @param root
   * @param val
   * @return
   */
  public TreeNode insertIntoMaxTree(TreeNode root, int val) {
    var a = getA(
      new ArrayList<TreeNode>() {
        {
          if (root != null) {
            add(root);
          }
        }
      },
      0
    );
    a.add(new TreeNode(val));
    return getConstructB(a, val > root.val ? a.size() - 1 : a.indexOf(root));
  }
}
```

### [1582] 二进制矩阵中的特殊位置

Time: 2022-09-04

Difficulty: Easy (66.93%)

Tags: Unknown

```java
class Solution {

  /**
   * 95/95 cases passed (1 ms)
   * Your runtime beats 100 % of java submissions
   * Your memory usage beats 70.69 % of java submissions (41.5 MB)
   * @param mat
   * @return
   */
  public int numSpecial(int[][] mat) {
    var rows = mat.length;
    var cols = mat[0].length;
    var rowNumOf1 = new int[rows];
    var colsNumOf1 = new int[cols];
    var res = 0;
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        if (mat[i][j] == 1) {
          rowNumOf1[i]++;
          colsNumOf1[j]++;
        }
      }
    }
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        if (mat[i][j] == 1 && rowNumOf1[i] == 1 && colsNumOf1[j] == 1) {
          res++;
        }
      }
    }
    return res;
  }
}
```

### [646] 最长数对链

Time: 2022-09-04

Difficulty: Medium (58.62%)

Tags: dynamic-programming

```java
class Solution {

  /**
   * 205/205 cases passed (30 ms)
   * Your runtime beats 37.5 % of java submissions
   * Your memory usage beats 92.1 % of java submissions (41.3 MB)
   * @param pairs
   * @return
   */
  public int findLongestChain(int[][] pairs) {
    var res = 0;
    var dp = new int[pairs.length];
    Arrays.sort(
      pairs,
      new Comparator<int[]>() {
        @Override
        public int compare(int[] o1, int[] o2) {
          return o1[0] - o2[0];
        }
      }
    );
    for (int i = 1; i < pairs.length; i++) {
      for (int j = i - 1; j >= 0; j--) {
        if (pairs[i][0] > pairs[j][1]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }
      res = Math.max(res, dp[i]);
    }
    return res + 1;
  }
}
```

### [652] 寻找重复的子树

Time: 2022-09-05

Difficulty: Medium (58.78%)

Tags: tree

二叉树使用先序或后续遍历带上 null，便可以确定整个树（中序无法确定根节点位置）

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {

  private Map<String, Integer> mp = new HashMap<>();
  private List<TreeNode> res = new ArrayList<>();

  private String preOrderTraversal(TreeNode node) {
    if (node == null) {
      return "#";
    }
    var str =
      String.valueOf(node.val) +
      " " +
      preOrderTraversal(node.left) +
      " " +
      preOrderTraversal(node.right);
    if (mp.getOrDefault(str, 0) == 1) {
      res.add(node);
    }
    mp.put(str, mp.getOrDefault(str, 0) + 1);
    return str;
  }

  /**
   * 176/176 cases passed (19 ms)
   * Your runtime beats 84.97 % of java submissions
   * Your memory usage beats 42.36 % of java submissions (48.5 MB)
   * <p>
   * {@link https://leetcode.cn/problems/find-duplicate-subtrees/comments/}
   * </p>
   * @author
   * wooooo(cpp实现)
   * @param root
   * @return
   */
  public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
    preOrderTraversal(root);
    return res;
  }
}
```

### [828] 统计子串中的唯一字符

Time: 2022-09-06

Difficulty: Hard (55.87%)

Tags: math

自己的方法处于超时边缘了，再多几个大的测试用例就超时了

```java
class MySolution {

  /**
   * 76/76 cases passed (1864 ms)
   * Your runtime beats 5.36 % of java submissions
   * Your memory usage beats 52.86 % of java submissions (42.3 MB)
   * @param s
   * @return
   */
  public int uniqueLetterString(String s) {
    var res = 0;
    for (var i = 0; i < s.length(); i++) {
      var hash = new int[26];
      var unique = 1;
      var ge2 = 0;
      hash[s.charAt(i) - 'A'] += unique;
      res++;
      for (var j = i + 1; j < s.length(); j++) {
        if (ge2 == 26) {
          break;
        }
        var h = hash[s.charAt(j) - 'A']++;
        switch (h) {
          case 0:
            unique++;
            res += unique;
            break;
          case 1:
            unique--;
            ge2++;
            res += unique;
            break;
          default:
            res += unique;
            break;
        }
      }
    }
    return res;
  }
}
```

官方正解

```java
class Solution {

  /**
   * 76/76 cases passed (46 ms)
   * Your runtime beats 45.36 % of java submissions
   * Your memory usage beats 19.65 % of java submissions (49.2 MB)
   * <p>
   * {@link https://leetcode.cn/problems/count-unique-characters-of-all-substrings-of-a-given-string/solution/tong-ji-zi-chuan-zhong-de-wei-yi-zi-fu-b-h9pj/}
   * </p>
   * <p>
   * 对于下标为 i 的字符 c<sub>i</sub>，当它在某个子字符串中仅出现一次时，它会对这个子字符串统计唯一字符时有贡献。只需对每个字符，计算有多少子字符串仅包含该字符一次即可。对于 c<sub>i</sub> ， 记同字符上一次出现的位置为 c<sub>j</sub> ，下一次出现的位置为 c<sub>k</sub> ，那么这样的子字符串就一共有 (c<sub>i</sub> - c<sub>j</sub>) × (c<sub>k</sub> - c<sub>i</sub>)(c<sub>i</sub> −c<sub>j</sub> )×(c<sub>k</sub> −c<sub>i</sub> ) 种，即子字符串的起始位置有 c<sub>j</sub> （不含）到 c<sub>i</sub> （含）之间这 (c<sub>i</sub> - c<sub>j</sub>)(c<sub>i</sub> −c<sub>j</sub> ) 种可能，到结束位置有 (c<sub>k</sub> - c<sub>i</sub>)(c<sub>k</sub> −c<sub>i</sub> ) 种可能。可以预处理 s，将相同字符的下标放入数组中，方便计算。最后对所有字符进行这种计算即可。
   * </p>
   * @param s
   * @return
   */
  public int uniqueLetterString(String s) {
    var index = new HashMap<Character, List<Integer>>();
    for (var i = 0; i < s.length(); i++) {
      var c = s.charAt(i);
      if (!index.containsKey(c)) {
        index.put(c, new ArrayList<Integer>());
        index.get(c).add(-1);
      }
      index.get(c).add(i);
    }
    int res = 0;
    for (var entry : index.entrySet()) {
      var arr = entry.getValue();
      arr.add(s.length());
      for (var i = 1; i < arr.size() - 1; i++) {
        res += (arr.get(i) - arr.get(i - 1)) * (arr.get(i + 1) - arr.get(i));
      }
    }
    return res;
  }
}
```

### [1592] 重新排列单词间的空格

Time: 2022-09-07

Difficulty: Easy (43.87%)

Tags: Unknown

```java
class Solution {

  /**
   * 89/89 cases passed (2 ms)
   * Your runtime beats 38.41 % of java submissions
   * Your memory usage beats 91.43 % of java submissions (39.3 MB)
   * @param text
   * @return
   */
  public String reorderSpaces(String text) {
    var beginAndEnd = new ArrayList<int[]>();
    var spacesNum = 0;
    var start = 0;
    for (int i = 0; i < text.length(); i++) {
      if (text.charAt(i) == ' ') {
        spacesNum++;
        if (i != 0 && text.charAt(i - 1) != ' ') {
          beginAndEnd.add(new int[] { start, i });
        }
      }
      if (text.charAt(i) != ' ' && (i == 0 || text.charAt(i - 1) == ' ')) {
        start = i;
      }
    }
    if (!text.endsWith(" ")) {
      beginAndEnd.add(new int[] { start, text.length() });
    }
    var wordsNum = beginAndEnd.size();
    Function<Integer, String> makeSpaces = num -> {
      var res = "";
      for (int i = 0; i < num; i++) {
        res += " ";
      }
      return res;
    };
    if (wordsNum == 1) {
      var word = beginAndEnd.get(0);
      return (
        text.substring(word[0], word[1]) +
        makeSpaces.apply(text.length() - (word[1] - word[0]))
      );
    }
    var gapSpaces = makeSpaces.apply(spacesNum / (wordsNum - 1));
    var lastSpaces = makeSpaces.apply(
      spacesNum - gapSpaces.length() * (wordsNum - 1)
    );
    var res = "";
    for (var i = 0; i < wordsNum; i++) {
      var bAndE = beginAndEnd.get(i);
      res += text.substring(bAndE[0], bAndE[1]);
      if (i == wordsNum - 1) {
        res += lastSpaces;
      } else {
        res += gapSpaces;
      }
    }
    return res;
  }
}
```

### [850] 矩形面积 II

Time: 2022-09-16

Difficulty: Hard (48.43%)

Tags: linked-list

```java
class Solution {

  private final int MOD = 1000000007;

  /**
   * <p>
   * 78/78 cases passed (11 ms)
   * Your runtime beats 19.74 % of java submissions
   * Your memory usage beats 95.39 % of java submissions (40.6 MB)
   * </p>
   * {@link https://leetcode.cn/problems/rectangle-area-ii/solution/ju-xing-mian-ji-ii-by-leetcode-solution-ulqz/}
   * @param rectangles
   * @return
   */
  public int rectangleArea(int[][] rectangles) {
    var n = rectangles.length;
    // 去掉纵坐标重复
    var set = new HashSet<Integer>();
    for (int[] rect : rectangles) {
      // 下边界
      set.add(rect[1]);
      // 上边界
      set.add(rect[3]);
    }
    var hbound = new ArrayList<Integer>(set);
    Collections.sort(hbound);
    // 「思路与算法部分」的 length 数组并不需要显式地存储下来
    // length[i] 可以通过 hbound[i+1] - hbound[i] 得到
    // seg[i]表示第 i 个线段被矩形覆盖的次数
    var seg = new int[hbound.size() - 1];

    var sweep = new ArrayList<int[]>();
    for (var i = 0; i < n; ++i) {
      // 左边界
      sweep.add(new int[] { rectangles[i][0], i, 1 });
      // 右边界
      sweep.add(new int[] { rectangles[i][2], i, -1 });
    }
    Collections.sort(
      sweep,
      (a, b) -> {
        if (a[0] != b[0]) {
          return a[0] - b[0];
        } else if (a[1] != b[1]) {
          return a[1] - b[1];
        } else {
          return a[2] - b[2];
        }
      }
    );

    var ans = 0L;
    for (var i = 0; i < sweep.size(); ++i) {
      // 一次性地处理掉一批横坐标相同的左右边界
      var j = i;
      while (j + 1 < sweep.size() && sweep.get(i)[0] == sweep.get(j + 1)[0]) {
        ++j;
      }
      if (j + 1 == sweep.size()) {
        break;
      }
      for (var k = i; k <= j; ++k) {
        var arr = sweep.get(k);
        var idx = arr[1];
        var dif = arr[2];
        var btm = rectangles[idx][1];
        var hig = rectangles[idx][3];
        for (var x = 0; x < hbound.size() - 1; ++x) {
          if (btm <= hbound.get(x) && hbound.get(x + 1) <= hig) {
            seg[x] += dif;
          }
        }
      }
      var cover = 0;
      for (var k = 0; k < hbound.size() - 1; ++k) {
        if (seg[k] > 0) {
          cover += (hbound.get(k + 1) - hbound.get(k));
        }
      }
      ans += (long) cover * (sweep.get(j + 1)[0] - sweep.get(j)[0]);
      i = j;
    }
    return (int) (ans % MOD);
  }
}
```

### [1636] 按照频率将数组升序排序

Time: 2022-09-19

Difficulty: Easy (69.45%)

Tags: Unknown

```java
class Solution {

  /**
   * 180/180 cases passed (6 ms)
   * Your runtime beats 45.66 % of java submissions
   * Your memory usage beats 80.64 % of java submissions (41.5 MB)
   * @param nums
   * @return
   */
  public int[] frequencySort(int[] nums) {
    var hash = new HashMap<Integer, Integer>();
    for (var num : nums) {
      hash.put(num, hash.getOrDefault(num, 0) + 1);
    }
    var set = new TreeSet<Map.Entry<Integer, Integer>>(
      (o1, o2) -> {
        if (o1.getValue() != o2.getValue()) {
          return o1.getValue() - o2.getValue();
        } else {
          return o2.getKey() - o1.getKey();
        }
      }
    ) {
      {
        addAll(hash.entrySet());
      }
    };
    var res = new int[nums.length];
    var i = 0;
    for (var entry : set) {
      for (var j = 0; j < entry.getValue(); j++) {
        res[i + j] = entry.getKey();
      }
      i += entry.getValue();
    }
    return res;
  }
}
```

### [698] 划分为 k 个相等的子集

Time: 2022-09-20

Difficulty: Medium (41.40%)

Tags: dynamic-programming | recursion

```java
class Solution {

  private int[] nums;
  /**
   * 表示当前每个子集的和
   */
  private int[] cur;
  private int sum;

  /**
   * 从最后一个元素开始，依次尝试将其加入到 cur 的每个子集中。这里如果将 nums[i] 加入某个子集 cur[j] 后，子集的和超过 sum，说明无法放入，可以直接跳过；另外，如果 cur[j] 与 cur[j - 1] 相等，意味着我们在 cur[j - 1] 的时候已经完成了搜索，也可以跳过当前的搜索。
   * @param i
   * @return
   */
  private boolean dfs(int i) {
    if (i < 0) {
      return true;
    }
    for (int j = 0; j < cur.length; ++j) {
      // 这一步为了剪枝
      if (j > 0 && cur[j] == cur[j - 1]) {
        continue;
      }
      cur[j] += nums[i];
      if (cur[j] <= sum && dfs(i - 1)) {
        return true;
      }
      cur[j] -= nums[i];
    }
    return false;
  }

  /**
   * 162/162 cases passed (3 ms)
   * Your runtime beats 81.6 % of java submissions
   * Your memory usage beats 64.06 % of java submissions (39.2 MB)
   * @param nums
   * @param k
   * @return
   */
  public boolean canPartitionKSubsets(int[] nums, int k) {
    sum = Arrays.stream(nums).sum();
    if (sum % k != 0) {
      return false;
    }
    sum /= k;
    cur = new int[k];
    Arrays.sort(nums);
    this.nums = nums;
    return dfs(nums.length - 1);
  }
}
```

### [1624] 两个相同字符之间的最长子字符串

Time: 2022-09-21

Difficulty: Easy (61.90%)

Tags: Unknown

```java
class Solution {

  /**
   * 54/54 cases passed (1 ms)
   * Your runtime beats 64.21 % of java submissions
   * Your memory usage beats 84.58 % of java submissions (39.1 MB)
   */
  public int maxLengthBetweenEqualCharacters(String s) {
    var firstPos = new Integer[26];
    var max = -1;
    for (int i = 0; i < s.length(); i++) {
      if (firstPos[s.charAt(i) - 'a'] == null) {
        firstPos[s.charAt(i) - 'a'] = i;
      } else {
        max = Math.max(i - firstPos[s.charAt(i) - 'a'] - 1, max);
      }
    }
    return max;
  }
}
```

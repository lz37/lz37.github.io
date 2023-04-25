---
title: LeetCode刷题笔记(2022-06)
toc_number: true
categories: algorithm
tags:
  - LeetCode
description: 2022-06-02 -> 2022-06-30
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
---

### [461] 汉明距离

Time: 2022-06-02

Difficulty: Easy (81.64%)

Tags: bit-manipulation

两个整数之间的[汉明距离](https://baike.baidu.com/item/%E6%B1%89%E6%98%8E%E8%B7%9D%E7%A6%BB)指的是这两个数字对应二进制位不同的位置的数目。

非常简单

```c++
class Solution {
public:
  /**
   * @brief
   * 149/149 cases passed (0 ms)
   * Your runtime beats 100 % of cpp submissions
   * Your memory usage beats 65.83 % of cpp submissions (5.8 MB)
   * @param x
   * @param y
   * @return int
   */
  int hammingDistance(int x, int y) {
    int res = x % 2 != y % 2;
    for (int i = 0; i < 31; i++)
      res += (x >>= 1) % 2 != (y >>= 1) % 2;
    return res;
  }
};
```

### [494] 目标和

Time: 2022-06-02

Difficulty: Medium (49.03%)

Tags: dynamic-programming | depth-first-search

自己没做出来，运行超时了

首先贴一下自己的方法

```c++
class MySolution {
private:
  int hammingDistance(int x, int y) {
    int res = x % 2 != y % 2;
    for (int i = 0; i < 31; i++)
      res += (x >>= 1) % 2 != (y >>= 1) % 2;
    return res;
  }

public:
  /**
   * @brief
   * 超时
   * @param nums
   * @param target
   * @return int
   */
  int findTargetSumWays(vector<int> &nums, int target) {
    auto possibilities = 1;
    long long max = 0;
    for (auto num : nums) {
      max += num;
      possibilities <<= 1;
    }
    vector<long long> dp(possibilities);
    dp[possibilities - 1] = max;
    int count = max == target;
    for (int i = possibilities - 2; i >= 0; i--) {
      for (int j = i + 1; j < possibilities; j++) {
        if (hammingDistance(i, j) == 1) {
          auto sub = j - i, tmp = 0;
          while (sub > 0) {
            sub >>= 1;
            tmp += 1;
          }
          dp[i] = dp[j] - 2 * (nums[nums.size() - tmp]);
          count += dp[i] == target;
          break;
        }
      }
    }
    return count;
  }
};
```

然后是正解

```c++
class Solution {
public:
  /**
   * @brief
   * 139/139 cases passed (4 ms)
   * Your runtime beats 97.46 % of cpp submissions
   * Your memory usage beats 39.23 % of cpp submissions (9.1 MB)
   * sum(P) 前面符号为+的集合；sum(N) 前面符号为减号的集合
   * 所以题目可以转化为
   * sum(P) - sum(N) = target
   * => sum(nums) + sum(P) - sum(N) = target + sum(nums)
   * => 2 * sum(P) = target + sum(nums)
   * => sum(P) = (target + sum(nums)) / 2
   * 因此题目转化为01背包，也就是能组合成容量为sum(P)的方式有多少种
   * @param nums
   * @param target
   * @return int
   */
  int findTargetSumWays(vector<int> &nums, int target) {
    int sum = 0;
    for (auto num : nums)
      sum += num;
    if (sum < target || -sum > target || (sum + target) % 2 == 1)
      return 0;
    int w = (sum + target) / 2;
    vector<int> dp(w + 1, 0);
    dp[0] = 1;
    for (auto num : nums)
      for (int j = w; j >= num; j--)
        dp[j] += dp[j - num];
    return dp[w];
  }
};
```

### [538] 把二叉搜索树转换为累加树

Time: 2022-06-03

Difficulty: Medium (73.65%)

Tags: tree

把链表，树之类的放在数组里就很爽

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
private:
  void dfs(std::vector<TreeNode *> &nodes, TreeNode *root) {
    if (root) {
      nodes.push_back(root);
      dfs(nodes, root->left);
      dfs(nodes, root->right);
    }
  }

public:
  /**
   * @brief
   * 215/215 cases passed (36 ms)
   * Your runtime beats 57.83 % of cpp submissions
   * Your memory usage beats 5.02 % of cpp submissions (33.4 MB)
   * @param root
   * @return TreeNode*
   */
  TreeNode *convertBST(TreeNode *root) {
    std::vector<TreeNode *> nodes;
    dfs(nodes, root);
    std::sort(nodes.begin(), nodes.end(),
              [](TreeNode *a, TreeNode *b) { return a->val < b->val; });
    for (int i = nodes.size() - 2; i >= 0; i--)
      nodes[i]->val += nodes[i + 1]->val;
    return root;
  }
};
```

---
title: LeetCode刷题笔记(2022-05)
toc_number: false
categories: algorithm
tags:
  - LeetCode
description: 2022-05-18 -> 2022-05-31
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

蓝桥杯的省赛拿到了一等奖，顺利进入国赛，于是又要刷题了……

所有的题目储存在仓库：<https://github.com/lz37/leetcode>, 不过最近才开始在 github 上存储，以前的题目则因为没有保存而丢失掉了。

### [399] 除法求值

Time: 2022-05-18

Difficulty: Medium (59.26%)

Tags: union-find | graph

太久没做了，忘了还可以用并查集

```c++
class Solution {
private:
  map<string, map<string, double>> graph;
  double findTarget(string start, string target, set<string> visited) {
    if (start == target)
      return 1.0;
    for (auto entry : graph[start]) {
      if (visited.find(entry.first) != visited.end())
        continue;
      visited.insert(entry.first);
      double tmp = findTarget(entry.first, target, visited);
      if (tmp != -1.0)
        return tmp * entry.second;
    }
    return -1.0;
  }

public:
  /**
   * @brief
   * 24/24 cases passed (4 ms)
   * Your runtime beats 46.42 % of cpp submissions
   * Your memory usage beats 5.07 % of cpp submissions (8.6 MB)
   * @param equations
   * @param values
   * @param queries
   * @return vector<double>
   */
  vector<double> calcEquation(vector<vector<string>> &equations,
                              vector<double> &values,
                              vector<vector<string>> &queries) {
    vector<double> ans(queries.size(), -1.0);
    for (int i = 0; i < equations.size(); i++) {
      graph[equations[i][0]][equations[i][1]] = values[i];
      graph[equations[i][1]][equations[i][0]] = 1 / values[i];
    }
    for (int i = 0; i < queries.size(); i++) {
      if (graph.find(queries[i][0]) != graph.end() &&
          graph.find(queries[i][1]) != graph.end()) {
        ans[i] = findTarget(queries[i][0], queries[i][1], set<string>());
      }
    }
    return ans;
  }
};
```

### [406] 根据身高重建队列

Time: 2022-05-19

Difficulty: Medium (75.03%)

Tags: greedy

自己的做法，成绩比较捞

```c++
class MySolution {
private:
  void forward(int pos, vector<vector<int>> &people, vector<int> &biggers) {
    biggers[pos - 1] += people[pos - 1][0] <= people[pos][0];
    biggers[pos] -= people[pos - 1][0] >= people[pos][0];
    swap(biggers[pos], biggers[pos - 1]);
    swap(people[pos], people[pos - 1]);
  }
  void backward(int pos, vector<vector<int>> &people, vector<int> &biggers) {
    biggers[pos] += people[pos + 1][0] >= people[pos][0];
    biggers[pos + 1] -= people[pos + 1][0] <= people[pos][0];
    swap(biggers[pos], biggers[pos + 1]);
    swap(people[pos], people[pos + 1]);
  }

public:
  /**
   * @brief
   * 36/36 cases passed (528 ms)
   * Your runtime beats 5.11 % of cpp submissions
   * Your memory usage beats 89.94 % of cpp submissions (11.5 MB)
   * @param people
   * @return vector<vector<int>>
   */
  vector<vector<int>> reconstructQueue(vector<vector<int>> &people) {
    vector<int> biggers(people.size());
    for (int i = 0; i < people.size(); i++) {
      int bigger = 0;
      for (int j = i - 1; j >= 0; j--) {
        bigger += people[j][0] >= people[i][0];
      }
      biggers[i] = bigger;
    }
    bool correct = 0;
    while (!correct) {
      correct = 1;
      for (int i = 1; i < people.size(); i++)
        if (biggers[i] > people[i][1]) {
          correct = 0;
          forward(i, people, biggers);
        }
      for (int i = people.size() - 2; i >= 0; i--)
        if (biggers[i] < people[i][1]) {
          correct = 0;
          backward(i, people, biggers);
        }
    }
    return people;
  }
};
```

大神的解析

大概的思路如下

1. 通过排序，使得按顺序遍历时，当前的人的身高与位置要求综合考虑下来是没有排序中的最前的
2. 由于题目保证没有错误，也就是说例如 (5,0) , (5,2) 中间必有 (7,0) 那么就大胆插入就好了

**提示**：使用 vector 是非常费时的，C++中 vector（可以理解是一个动态数组，底层是普通数组实现的）如果插入元素大于预先普通数组大小，vector 底部会有一个扩容的操作，即申请两倍于原先普通数组的大小，然后把数据拷贝到另一个更大的数组上。

所以使用 vector（动态数组）来 insert，是费时的，插入再拷贝的话，单纯一个插入的操作就是 O( n^2 )了，甚至可能拷贝好几次，就不止 O( n^2 )了。

追求速度的话，可以把 vector 换成链表

```c++
class Solution {
  static bool cmp(vector<int> &a, vector<int> &b) {
    if (a[0] == b[0]) {
      // if height value is the same, then sort by k in raising powers
      return a[1] < b[1];
    } else {
      return a[0] > b[0]; // sort by height in descending powers
    }
  }

public:
  /**
   * @brief
   * 36/36 cases passed (148 ms)
   * Your runtime beats 34.16 % of cpp submissions
   * Your memory usage beats 41.15 % of cpp submissions (12.3 MB)
   * @param people
   * @return vector<vector<int>>
   */
  vector<vector<int>> reconstructQueue(vector<vector<int>> &people) {
    sort(people.begin(), people.end(), cmp);
    // after sort the example we get this vector:
    // [[7,0],[7,1],[6,1],[5,0],[5,2],[4,4]]
    vector<vector<int>> res;
    for (auto x : people) {
      // insert the biggest height people first and insert in the k-th position
      res.insert(res.begin() + x[1], x); // insert method: (position, value)
    }
    return res;
  }
};
```

### [416] 分割等和子集

Time: 2020-05-20

Difficulty: Medium (51.73%)

Tags: dynamic-programming

比较经典的 dp，但还是做了好久 (；′⌒`)

```c++
class Solution {
public:
  /**
   * @brief
   * 117/117 cases passed (124 ms)
   * Your runtime beats 82.51 % of cpp submissions
   * Your memory usage beats 36.1 % of cpp submissions (12.1 MB)
   * @param nums
   * @return true
   * @return false
   */
  bool canPartition(vector<int> &nums) {
    int sum = 0;
    for (auto num : nums)
      sum += num;
    if (sum / 2 != (sum + 1) / 2)
      return false;
    else {
      int target = sum / 2;
      vector<vector<int>> dp(nums.size(), vector<int>(nums.size(), 0));
      for (int i = nums.size() - 1; i >= 0; i--) {
        for (int j = i; j < nums.size(); j++) {
          if (j == i) {
            if (nums[i] <= target)
              dp[i][j] = nums[i];
          } else {
            for (int k = i; k < j; k++) {
              int tmp = max(dp[i][j], nums[j] + dp[i][k]);
              dp[i][j] = tmp > target ? dp[i][j] : tmp;
            }
            for (int k = nums.size() - 1 - i; k > j; k--) {
              int tmp = max(dp[i][j], nums[i] + dp[k][j]);
              dp[i][j] = tmp > target ? dp[i][j] : tmp;
            }
          }
          if (dp[i][j] == target)
            return true;
        }
      }
      return false;
    }
  }
};
```

### [437] 路径总和 III

Time: 2020-05-29

Difficulty: Medium (56.77%)

Tags: tree

难以置信这么简单

```cpp
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
  int count = 0;
  int target;
  void dfs(TreeNode *root) {
    if (root) {
      subDfs(root, root, root->val);
      dfs(root->left);
      dfs(root->right);
    }
  }
  void subDfs(TreeNode *root, TreeNode *child, long long val) {
    if (val == target)
      count++;
    if (child->left)
      subDfs(root, child->left, val + child->left->val);
    if (child->right)
      subDfs(root, child->right, val + child->right->val);
  }

public:
  /**
   * @brief
   * 127/127 cases passed (12 ms)
   * Your runtime beats 90.23 % of cpp submissions
   * Your memory usage beats 55.79 % of cpp submissions (15.6 MB)
   * @param root
   * @param targetSum
   * @return int
   */
  int pathSum(TreeNode *root, int targetSum) {
    target = targetSum;
    dfs(root);
    return count;
  }
};
```

### [448] 找到所有数组中消失的数字

Time: 2020-05-29

Difficulty: Easy (65.62%)

Tags: array

虽然是 easy 难度，但是这题还有一个附加题：

**进阶**：你能在不使用额外空间且时间复杂度为 O(n) 的情况下解决这个问题吗? 你可以假定返回的数组不算在额外空间内。

我自己没有想到这个方法，以下是原答案

```c++
class MySolution {
public:
  /**
   * @brief
   * 33/33 cases passed (32 ms)
   * Your runtime beats 98.31 % of cpp submissions
   * Your memory usage beats 49.53 % of cpp submissions (32.9 MB)
   * @param nums
   * @return vector<int>
   */
  vector<int> findDisappearedNumbers(vector<int> &nums) {
    vector<bool> hash(nums.size() + 1, 0);
    for (auto num : nums)
      hash[num] = 1;
    vector<int> res;
    for (int i = 1; i <= nums.size(); i++)
      if (!hash[i])
        res.push_back(i);
    return res;
  }
};
```

正解：

简单来说，就是用正负号替代了哈希表

```c++
class Solution {
public:
  /**
   * @brief
   * 33/33 cases passed (36 ms)
   * Your runtime beats 93.98 % of cpp submissions
   * Your memory usage beats 67.52 % of cpp submissions (32.8 MB)
   * 举例
   * [4,3,2,7,8,2,3,1] 初始数据
   * [4,3,2,-7,8,2,3,1]
   * 第一个数据 4 出现，将数组的第四个也就是下标 3 的数据修改为负数 -7
   * 计算时，通过绝对值处理一下即可不影响数据的计算
   * [4,3,-2,-7,8,2,3,1]
   * [4,-3,-2,-7,8,2,3,1]
   * [4,-3,-2,-7,8,2,-3,1]
   * [4,-3,-2,-7,8,2,-3,-1]
   * [4,-3,-2,-7,8,2,-3,-1]
   * [4,-3,-2,-7,8,2,-3,-1]
   * [-4,-3,-2,-7,8,2,-3,-1]
   * 计算结束，数组的第五个，第六个依然为正数，证明 5,6 没有出现
   * 简单来说，就是用正负号替代了哈希表
   * @param nums
   * @return vector<int>
   */
  vector<int> findDisappearedNumbers(vector<int> &nums) {
    for (int i = 0; i < nums.size(); i++)
      if (nums[abs(nums[i]) - 1] > 0)
        nums[abs(nums[i]) - 1] = -nums[abs(nums[i]) - 1];
    vector<int> res;
    for (int i = 0; i < nums.size(); i++)
      if (nums[i] > 0)
        res.push_back(i + 1);
    return res;
  }
};
```

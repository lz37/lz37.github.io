---
title: LeetCode刷题笔记(2022-11)
toc_number: true
categories: algorithm
tags:
  - LeetCode
keywords:
description: 2022-11-01 -> 2022-11-30
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

### [345] Reverse Vowels of a String

Time: 2022-11-04

Difficulty: Easy (47.72%)

Tags: two-pointers | string

我的解法，比较慢

```csharp
public class MySolution
{
    private static readonly char[] vowels = { 'a', 'e', 'i', 'o', 'u' };

    private bool isOfVowels(char ch)
    {
        var res = false;
        vowels
            .ToList()
            .ForEach(
                (c) =>
                {
                    if (char.ToLower(ch) == c)
                    {
                        res = true;
                    }
                }
            );
        return res;
    }

    /// <summary>
    /// 480/480 cases passed (231 ms)
    /// Your runtime beats 18.22 % of csharp submissions
    /// Your memory usage beats 24.81 % of csharp submissions (41.1 MB)
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string ReverseVowels(string s)
    {
        var vowelsPoses = new List<int>();
        for (int i = 0; i < s.Length; i++)
        {
            if (isOfVowels(s[i]))
            {
                vowelsPoses.Add(i);
            }
        }
        var sBuilder = new StringBuilder(s);
        for (int i = 0; i < vowelsPoses.Count / 2; i++)
        {
            (sBuilder[vowelsPoses[i]], sBuilder[vowelsPoses[vowelsPoses.Count - 1 - i]]) = (
                sBuilder[vowelsPoses[vowelsPoses.Count - 1 - i]],
                sBuilder[vowelsPoses[i]]
            );
        }
        return sBuilder.ToString();
    }
}
```

大佬解法，速度提升了 90ms，内存减少了 2m，复杂度是相同的

```csharp
public class Solution
{
    private static readonly ISet<char> vowels = new HashSet<char>(new char[] { 'a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U' });
    /// <summary>
    /// 480/480 cases passed (141 ms)
    /// Your runtime beats 64.34 % of csharp submissions
    /// Your memory usage beats 82.17 % of csharp submissions (39 MB)
    /// <see href="https://leetcode.com/problems/reverse-vowels-of-a-string/discuss/81225/Java-Standard-Two-Pointer-Solution"/>
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string ReverseVowels(string s)
    {
        var chars = s.ToCharArray();
        var start = 0;
        var end = s.Length - 1;
        while (end > start)
        {
            while (start < end && !vowels.Contains(chars[start]))
            {
                start++;
            }
            while (start < end && !vowels.Contains(chars[end]))
            {
                end--;
            }
            (chars[start], chars[end]) = (chars[end], chars[start]);
            start++;
            end--;
        }
        return new string(chars);
    }
}
```

### [212] Word Search II

Time: 2022-11-05

Difficulty: Hard (36.89%)

Tags: backtracking | trie

```csharp
public class Solution
{
    private class TrieNode
    {
        public TrieNode[] next = new TrieNode[26];
        public string? word;
    }
    /// <summary>
    /// <code>以words = ["oath","pea","eat","rain"]为例</code>
    /// 在root节点下生成o->a->t->h（最后一节点word=oath）及其他节点组成的树
    /// 该例子看不出来，如果是aot、apple两个单词，那么root的next[a]就是公用的
    /// </summary>
    /// <param name="words"></param>
    /// <returns></returns>
    private TrieNode buildNode(string[] words)
    {
        var root = new TrieNode();
        foreach (var word in words)
        {
            var p = root;
            foreach (var ch in word)
            {
                int i = ch - 'a';
                if (p.next[i] is null)
                {
                    p.next[i] = new TrieNode();
                }
                p = p.next[i];
            }
            p.word = word;
        }
        return root;
    }

    private void dfs(char[][] board, int i, int j, TrieNode p, IList<string> res)
    {
        var c = board[i][j];
        if (c == '#' || p.next[c - 'a'] is null)
        {
            return;
        }
        p = p.next[c - 'a'];
        // 到底了
        if (p.word is not null)
        {
            res.Add(p.word);
            p.word = null;
        }
        // visited
        board[i][j] = '#';
        // 四方延伸
        if (i > 0) dfs(board, i - 1, j, p, res);
        if (j > 0) dfs(board, i, j - 1, p, res);
        if (i < board.Length - 1) dfs(board, i + 1, j, p, res);
        if (j < board[0].Length - 1) dfs(board, i, j + 1, p, res);
        // not visited
        board[i][j] = c;
    }
    /// <summary>
    /// 64/64 cases passed (730 ms)
    /// Your runtime beats 71.19 % of csharp submissions
    /// Your memory usage beats 60.68 % of csharp submissions (47.4 MB)
    /// <see href="https://leetcode.com/problems/word-search-ii/discuss/59780/Java-15ms-Easiest-Solution-(100.00)"/>
    /// </summary>
    /// <param name="board"></param>
    /// <param name="words"></param>
    /// <returns></returns>
    public IList<string> FindWords(char[][] board, string[] words)
    {
        var res = new List<string>();
        var root = buildNode(words);
        for (int i = 0; i < board.Length; i++)
        {
            for (int j = 0; j < board[0].Length; j++)
            {
                dfs(board, i, j, root, res);
            }
        }
        return res;
    }
}
```

### [899] Orderly Queue

Time: 2022-11-06

Difficulty: Hard (58.96%)

Tags: math

一根死脑筋的我，直接超时了

```csharp
public class MySolution
{
    private ISet<string> list = new SortedSet<string>();
    private void dfs(StringBuilder sb, int i, ref int k)
    {
        sb.Append(sb[i]);
        sb.Remove(i, 1);
        if (list.Contains(sb.ToString()))
        {
            return;
        }
        list.Add(sb.ToString());
        for (int j = 0; j < k; j++)
        {
            dfs(new StringBuilder(sb.ToString()), j, ref k);
        }
    }
    public string OrderlyQueue(string s, int k)
    {
        list.Add(s);
        for (int i = 0; i < k; i++)
        {
            dfs(new StringBuilder(s), i, ref k);
        }
        return list.First();
    }
}
```

具体看注释

```csharp
public class Solution
{
    /// <summary>
    /// 111/111 cases passed (128 ms)
    /// Your runtime beats 42.86 % of csharp submissions
    /// Your memory usage beats 14.29 % of csharp submissions (38.8 MB)
    /// <see href="https://leetcode.com/problems/orderly-queue/discuss/165878/C%2B%2BJavaPython-Sort-String-or-Rotate-String"/>
    /// 我是万万没想到啊，k >= 2 时任意的两个元素都可以交换，那就类似冒泡排序，
    /// 直接排序就可以了，原理如下：
    /// <br/>
    /// Assume that we want to swap S[i] and S[i+1], we can first pop
    /// first i-1 characters to the end, then pop i+1 and i, finally pop i+2~end.
    /// </summary>
    /// <param name="s"></param>
    /// <param name="k"></param>
    /// <returns></returns>
    public string OrderlyQueue(string s, int k)
    {
        if (k > 1)
        {
            var chars = s.ToCharArray();
            Array.Sort(chars);
            return new string(chars);
        }
        string res = s;
        for (int i = 1; i < s.Length; i++)
        {
            string tmp = string.Concat(s.AsSpan(i), s.AsSpan(0, i));
            if (res.CompareTo(tmp) > 0)
                res = tmp;
        }
        return res;
    }
}
```

### [1323] Maximum 69 Number

Time: 2022-11-07

Difficulty: Easy (79.14%)

Tags: Unknown

弱智题

```csharp
public class Solution
{
    /// <summary>
    /// 153/153 cases passed (33 ms)
    /// Your runtime beats 75.74 % of csharp submissions
    /// Your memory usage beats 91.72 % of csharp submissions (25 MB)
    /// </summary>
    /// <param name="num"></param>
    /// <returns></returns>
    public int Maximum69Number(int num)
    {
        var str = new StringBuilder(num.ToString());
        for (int i = 0; i < str.Length; i++)
        {
            if (str[i] == '6')
            {
                str[i] = '9';
                break;
            }
        }
        return int.Parse(str.ToString());
    }
}
```

### [1544] Make The String Great

Time: 2022-11-08

Difficulty: Easy (57.11%)

Tags: Unknown

我的办法，嗯遍历

```csharp
public class MySolution
{
    /// <summary>
    /// 334/334 cases passed (148 ms)
    /// Your runtime beats 30.09 % of csharp submissions
    /// Your memory usage beats 18.58 % of csharp submissions (38.4 MB)
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string MakeGood(string s)
    {
        var sb = new StringBuilder(s);
        for (int i = 0; i < sb.Length - 1; )
        {
            if (char.ToLower(sb[i]) == char.ToLower(sb[i + 1]) && sb[i] != sb[i + 1])
            {
                sb.Remove(i, 2);
                if (i != 0)
                {
                    i--;
                }
            }
            else
            {
                i++;
            }
        }
        return sb.ToString();
    }
}
```

别人的办法，用栈，复杂度差不多，速度的提升感觉是波动

```csharp
public class Solution
{
    /// <summary>
    /// 334/334 cases passed (89 ms)
    /// Your runtime beats 88.5 % of csharp submissions
    /// Your memory usage beats 5.31 % of csharp submissions (40.1 MB)
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string MakeGood(string s)
    {
        var st = new Stack<char>();
        for (int i = 0; i < s.Length; i++)
        {
            if (st.Count > 0 && char.ToLower(st.Peek()) == char.ToLower(s[i]) && st.Peek() != s[i])
            {
                st.Pop();
            }
            else
            {
                st.Push(s[i]);
            }
        }
        var charArr = st.ToList().ToArray();
        Array.Reverse(charArr);
        return new string(charArr);
    }
}
```

### [901] Online Stock Span

Time: 2022-11-09

Difficulty: Medium (63.90%)

Tags: array | greedy

死方法

```csharp
/// <summary>
/// 99/99 cases passed (1428 ms)
/// Your runtime beats 5.56 % of csharp submissions
/// Your memory usage beats 5.56 % of csharp submissions (77.9 MB)
/// </summary>
public class SimpleStockSpanner
{
    private IList<int> prices = new List<int>();

    public SimpleStockSpanner() { }

    public int Next(int price)
    {
        var res = 1;
        for (int i = prices.Count - 1; i >= 0; i--)
        {
            if (price >= prices[i])
            {
                res++;
            }
            else
            {
                break;
            }
        }
        prices.Add(price);
        return res;
    }
}
```

大佬的方法，我也想把前面每一步结果存储起来做优化来着，但没写出来

```csharp
/// <summary>
/// 99/99 cases passed (637 ms)
/// Your runtime beats 77.78 % of csharp submissions
/// Your memory usage beats 53.7 % of csharp submissions (66.5 MB)
/// </summary>
public class StockSpanner
{
    private Stack<KeyValuePair<int, int>> stack = new Stack<KeyValuePair<int, int>>();

    public StockSpanner() { }

    /// <summary>
    /// 对于[100,80,60,70,60,75,85]，stack 变化为
    /// <code>
    /// 100 1
    ///
    /// 100 1 | 80 1
    ///
    /// 100 1 | 80 1 | 60 1
    ///
    /// 100 1 | 80 1 | 70 2
    ///
    /// 100 1 | 80 1 | 70 2 | 60 1
    ///
    /// 100 1 | 80 1 | 75 4
    ///
    /// 100 1 | 85 6
    ///
    /// </code>
    /// <see href="https://leetcode.com/problems/online-stock-span/discuss/168311/C%2B%2BJavaPython-O(1)"/>
    /// </summary>
    /// <param name="price"></param>
    /// <returns></returns>
    public int Next(int price)
    {
        int res = 1;
        while (stack.Count > 0 && stack.Peek().Key <= price)
        {
            res += stack.Pop().Value;
        }
        stack.Push(new KeyValuePair<int, int>(price, res));
        return res;
    }
}
```

### [1047] Remove All Adjacent Duplicates In String

Time: 2022-11-10

Difficulty: Easy (70.47%)

Tags: greedy

陈年老题

```csharp
{
    /// <summary>
    /// 106/106 cases passed (152 ms)
    /// Your runtime beats 66.35 % of csharp submissions
    /// Your memory usage beats 73.93 % of csharp submissions (38.5 MB)
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string RemoveDuplicates(string s)
    {
        var st = new Stack<char>();
        foreach (var ch in s)
        {
            if (st.Count > 0 && st.Peek() == ch)
            {
                st.Pop();
            }
            else
            {
                st.Push(ch);
            }
        }
        var chArr = st.ToArray();
        Array.Reverse(chArr);
        return new string(chArr);
    }
}
```

### [26] Remove Duplicates from Sorted Array

Time: 2022-11-11

Difficulty: Easy (50.35%)

Tags: array | two-pointers

```csharp
public class Solution
{
    /// <summary>
    /// 361/361 cases passed (153 ms)
    /// Your runtime beats 92.33 % of csharp submissions
    /// Your memory usage beats 14.65 % of csharp submissions (46 MB)
    /// </summary>
    /// <param name="nums"></param>
    /// <returns></returns>
    public int RemoveDuplicates(int[] nums)
    {
        var i = 0;
        var now = nums[0];
        var res = 1;
        for (int j = 0; j < nums.Length; j++)
        {
            if (nums[j] != now)
            {
                res++;
                nums[++i] = nums[j];
                now = nums[j];
            }
        }
        return res;
    }
}
```

### [295] Find Median from Data Stream

Time: 2022-11-12

Difficulty: Hard (51.09%)

Tags: heap | design

```csharp
/// <summary>
/// 21/21 cases passed (1073 ms)
/// Your runtime beats 53.87 % of csharp submissions
/// Your memory usage beats 89.59 % of csharp submissions (87.3 MB)
/// <see href="https://leetcode.com/problems/find-median-from-data-stream/discuss/74047/JavaPython-two-heap-solution-O(log-n)-add-O(1)-find"/>
/// 事先想过搞个平衡二叉树找中位数，但是太麻烦了，不过想想PriorityQueue就是由平衡二叉树实现的，那么左一个右一个就好了
/// 但是要注意large和small的优先级是反的，因为peek只拿最小值，但要挑出small的最大值才行
/// C#的PriorityQueue和Java不同，要额外传入一个优先度
/// </summary>
public class MedianFinder
{
    private PriorityQueue<int, int> small = new PriorityQueue<int, int>();
    private PriorityQueue<int, int> large = new PriorityQueue<int, int>();
    private bool even = true;

    public MedianFinder() { }

    public void AddNum(int num)
    {
        // 这里谁先谁后都无所谓，但要和FindMedian的对应上
        if (even)
        {
            small.Enqueue(num, -num);
            large.Enqueue(small.Peek(), small.Dequeue());
        }
        else
        {
            large.Enqueue(num, num);
            small.Enqueue(large.Peek(), -large.Dequeue());
        }
        even = !even;
    }

    public double FindMedian()
    {
        if (even)
            return (small.Peek() + large.Peek()) / 2.0;
        else
            return large.Peek();
    }
}
```

### [151] Reverse Words in a String

Time: 2022-11-13

Difficulty: Medium (30.30%)

Tags: string

普通做法，api 调用大师

```csharp
public class MySolution
{
    /// <summary>
    /// 58/58 cases passed (94 ms)
    /// Your runtime beats 83.17 % of csharp submissions
    /// Your memory usage beats 12.05 % of csharp submissions (38.8 MB)
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string ReverseWords(string s)
    {
        var strArr = new List<string>();
        Array.ForEach(
            s.Split(" "),
            str =>
            {
                if (str != "")
                {
                    strArr.Add(str);
                }
            }
        );
        strArr.Reverse();
        return string.Join(" ", strArr);
    }
}
```

附加题：If the string data type is mutable in your language, can you solve it in-place with O(1) extra space?

自己没想出来，抄的大佬题解，感觉现在脑子都不怎么会变通了

```csharp
public class Solution
{
    // reverse a[] from a[i] to a[j]
    private void reverse(char[] a, int i, int j)
    {
        while (i < j)
        {
            var t = a[i];
            a[i++] = a[j];
            a[j--] = t;
        }
    }

    private void reverseWords(char[] a, int n)
    {
        var i = 0;
        var j = 0;
        while (i < n)
        {
            while (i < j || i < n && a[i] == ' ')
                i++; // skip spaces
            while (j < i || j < n && a[j] != ' ')
                j++; // skip non spaces
            reverse(a, i, j - 1); // reverse the word
        }
    }

    // trim leading, trailing and multiple spaces
    private string cleanSpaces(char[] a, int n)
    {
        var i = 0;
        var j = 0;
        while (j < n)
        {
            while (j < n && a[j] == ' ')
                j++; // skip spaces
            while (j < n && a[j] != ' ')
                a[i++] = a[j++]; // keep non spaces
            while (j < n && a[j] == ' ')
                j++; // skip spaces
            if (j < n)
                a[i++] = ' '; // keep only one space
        }
        return new string(a)[..i];
    }

    /// <summary>
    /// 58/58 cases passed (129 ms)
    /// Your runtime beats 64.52 % of csharp submissions
    /// Your memory usage beats 98.02 % of csharp submissions (36.2 MB)
    /// <see href="https://leetcode.com/problems/reverse-words-in-a-string/discuss/47720/Clean-Java-two-pointers-solution-(no-trim(-)-no-split(-)-no-StringBuilder)"/>
    /// 思路类似于字符串翻转
    /// </summary>
    /// <param name="s"></param>
    /// <returns></returns>
    public string ReverseWords(string s)
    {
        if (s is null)
            return null;
        var a = s.ToCharArray();
        var n = a.Length;
        // step 1. reverse the whole string
        reverse(a, 0, n - 1);
        // step 2. reverse each word
        reverseWords(a, n);
        // step 3. clean up spaces
        return cleanSpaces(a, n);
    }
}
```

### [947] Most Stones Removed with Same Row or Column

Time: 2022-11-14

Difficulty: Medium (57.10%)

Tags: binary-search

#### 并查集

并查集在底层实现可以是数组，也可以是散列表，不管使用什么底层实现，关键在于能表示一个对应关系，即：key 或下标表示了节点本身，而 value 表示顶点的父亲节点，初始化时指向自己。

并查集两个**基本**操作：合并 & 查询

1. 合并操作 合并操作就是将一个节点的的父节点指向另一个的根节点
2. 查询操作 查询操作就是查询节点的根节点，如果两个节点的根节点相同，那么表示在一个集合中（相连）。

```csharp
public class Solution
{
    private IDictionary<int, int> f = new Dictionary<int, int>();
    // 剩下的数量
    private int islands = 0;

    /// <summary>
    /// 68/68 cases passed (223 ms)
    /// Your runtime beats 56.98 % of csharp submissions
    /// Your memory usage beats 89.53 % of csharp submissions (39.7 MB)
    /// <see href="https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/discuss/197668/Count-the-Number-of-Islands-O(N)"/>
    /// </summary>
    /// <param name="stones"></param>
    /// <returns></returns>
    public int RemoveStones(int[][] stones)
    {
        for (int i = 0; i < stones.Length; ++i)
            // stones[i][1] 按位取反，
            // 目的是为了不和stones[i][0]有交集，
            // 实际上10000+stones[i][1]也行
            union(stones[i][0], ~stones[i][1]);
        // 只要知道剩下的单独单元的个数，就能算出操作的次数
        return stones.Length - islands;
    }

    private int find(int x)
    {
        // 若不存在则让f[x]=x，表示新增一（行，列）
        if (!f.ContainsKey(x) && (f[x] = x) == x)
            islands++;
        // 一直找 找到根父节点
        if (x != f[x])
            f[x] = find(f[x]);
        return f[x];
    }

    private void union(int x, int y)
    {
        x = find(x);
        y = find(y);
        if (x != y)
        {
            f[x] = y;
            // X!=Y时表示在这一步前不连通，也就是之前没有搜到这个点（搜到的都联通了）
            // 那么上面的find x find y 就多了一个islands，于是减去
            // 到最后所有应该连通的不连通坐标都连通（因为把stones遍历了一遍）了，剩下的island就是最后剩余的孤立点
            islands--;
        }
    }
}
```

### [222] Count Complete Tree Nodes

Time: 2022-11-15

Difficulty: Medium (57.47%)

Tags: binary-search | tree

就嗯剪枝

```csharp
public class Solution
{
    private int deepth = 0;
    private int dfs(TreeNode node, int nowDeep, int pos)
    {
        if (node is { right: TreeNode, left: TreeNode })
        {
            var res = -1;
            if ((res = dfs(node.right, nowDeep + 1, pos * 2)) > 0)
                return res;
            if ((res = dfs(node.left, nowDeep + 1, pos * 2 - 1)) > 0)
                return res;
        }
        else if (node is { left: TreeNode })
        {
            deepth = nowDeep + 1;
            return pos * 2 - 1;
        }
        else
        {
            if (deepth == 0) { deepth = nowDeep; }
            if (nowDeep > deepth) { deepth++; return pos; }
        }
        return -1;
    }
    /// <summary>
    /// 18/18 cases passed (101 ms)
    /// Your runtime beats 94.37 % of csharp submissions
    /// Your memory usage beats 21.83 % of csharp submissions (46.3 MB)
    /// </summary>
    /// <param name="root"></param>
    /// <returns></returns>
    public int CountNodes(TreeNode root)
    {
        if (root is null)
            return 0;
        var pos = dfs(root, 1, 1);
        return pos < 0 ? (1 << deepth) - 1 : pos + (1 << (deepth - 1)) - 1;
    }
}
```

### [374] Guess Number Higher or Lower

Time: 2022-11-16

Difficulty: Easy (50.45%)

Tags: binary-search

```csharp
public class Solution : GuessGame
{
    /// <summary>
    /// 25/25 cases passed (11 ms)
    /// Your runtime beats 100 % of csharp submissions
    /// Your memory usage beats 19.49 % of csharp submissions (26.4 MB)
    /// </summary>
    /// <param name="n"></param>
    /// <returns></returns>
    public int GuessNumber(int n)
    {
        int guessV = n / 2;
        int guessR;
        int min = 0;
        int max = n;
        while ((guessR = guess(guessV)) != 0)
        {
            if (guessR == 1)
            {
                min = guessV;
                guessV = guessV / 2 + max / 2;
                if (guessV == min)
                {
                    guessV++;
                }
            }
            else
            {
                max = guessV;
                guessV = guessV / 2 + min / 2;
                if (guessV == max)
                {
                    guessV--;
                }
            }
        }
        return guessV;
    }
}
```

### [223] Rectangle Area

Time: 2022-11-17

Difficulty: Medium (40.85%)

Tags: math

```csharp
public class Solution
{
    private int getRectangleArea(int x1, int y1, int x2, int y2)
    {
        return (y2 - y1) * (x2 - x1);
    }

    /// <summary>
    /// 3080/3080 cases passed (20 ms)
    /// Your runtime beats 98.25 % of csharp submissions
    /// Your memory usage beats 21.05 % of csharp submissions (28.1 MB)
    /// </summary>
    /// <param name="ax1"></param>
    /// <param name="ay1"></param>
    /// <param name="ax2"></param>
    /// <param name="ay2"></param>
    /// <param name="bx1"></param>
    /// <param name="by1"></param>
    /// <param name="bx2"></param>
    /// <param name="by2"></param>
    /// <returns></returns>
    public int ComputeArea(int ax1, int ay1, int ax2, int ay2, int bx1, int by1, int bx2, int by2)
    {
        var aS = getRectangleArea(ax1, ay1, ax2, ay2);
        var bS = getRectangleArea(bx1, by1, bx2, by2);
        if (ax2 <= bx1 || ax1 >= bx2 || ay1 >= by2 || ay2 <= by1)
        {
            return aS + bS;
        }
        return aS + bS - getRectangleArea(Math.Max(ax1, bx1), Math.Max(ay1, by1), Math.Min(ax2, bx2), Math.Min(ay2, by2));
    }
}
```

### [263] Ugly Number

Time: 2022-11-18

Difficulty: Easy (41.64%)

Tags: math

```csharp
public class Solution
{
    /// <summary>
    /// 1013/1013 cases passed (45 ms)
    /// Your runtime beats 82.54 % of csharp submissions
    /// Your memory usage beats 13.49 % of csharp submissions (28.3 MB)
    /// </summary>
    /// <param name="n"></param>
    /// <returns></returns>
    public bool IsUgly(int n)
    {
        if (n == 0)
            return false;
        while (n % 2 == 0)
        {
            n /= 2;
        }
        while (n % 3 == 0)
        {
            n /= 3;
        }
        while (n % 5 == 0)
        {
            n /= 5;
        }
        if (n == 1)
            return true;
        return false;
    }
}
```

### [587] Erect the Fence

Time: 2022-11-19

Difficulty: Hard (43.14%)

Tags: geometry

```csharp
public class Solution
{
    private int cmp(int[] p1, int[] p2, int[] p3)
    {
        return (p3[1] - p2[1]) * (p2[0] - p1[0]) - (p2[1] - p1[1]) * (p3[0] - p2[0]);
    }
    /// <summary>
    /// 88/88 cases passed (233 ms)
    /// Your runtime beats 100 % of csharp submissions
    /// Your memory usage beats 100 % of csharp submissions (45.3 MB)
    /// <see href="https://leetcode.com/problems/erect-the-fence/discuss/1442266/A-Detailed-Explanation-with-Diagrams-(Graham-Scan)"/>
    /// </summary>
    /// <param name="trees"></param>
    /// <returns></returns>
    public int[][] OuterTrees(int[][] trees)
    {
        if (trees.Length <= 3) return trees;
        Array.Sort(trees, (a, b) =>
        {
            if (a[0] == b[0])
                return a[1] - b[1];
            else
                return a[0] - b[0];
        });
        var lower = new List<int[]>(); //下半部分
        var upper = new List<int[]>(); // 上半部分
        foreach (var tree in trees)
        {
            // 检查大于180的角
            while (lower.Count >= 2 && cmp(lower[^2], lower[^1], tree) < 0)
                lower.RemoveAt(lower.Count - 1);
            while (upper.Count >= 2 && cmp(upper[^2], upper[^1], tree) > 0)
                upper.RemoveAt(upper.Count - 1);
            lower.Add(tree);
            upper.Add(tree);
        }
        var set = new HashSet<int[]>(lower.Concat(upper));
        return set.ToArray();
    }
}
```

### [224] Basic Calculator

Time: 2022-11-20

Difficulty: Hard (41.16%)

Tags: math | stack

一开始照本宣科搞了两个栈，但其实没有必要，两个栈的作用是判断表达式是否合法，但是题目已经保证了表达式合法，所以可以省略这一步。

```csharp
public class Solution
{
    /// <summary>
    /// 44/44 cases passed (64 ms)
    /// Your runtime beats 97.88 % of csharp submissions
    /// Your memory usage beats 50.26 % of csharp submissions (38.6 MB)
    /// </summary>
    /// <see href="https://leetcode.com/problems/basic-calculator/discuss/62361/Iterative-Java-solution-with-stack"/>
    /// <param name="s"></param>
    /// <returns></returns>
    public int Calculate(string s)
    {
        var stack = new Stack<int>();
        var result = 0;
        var number = 0;
        var sign = 1;
        for (int i = 0; i < s.Length; i++)
        {
            char c = s[i];
            if (char.IsDigit(c))
            {
                number = 10 * number + (c - '0');
            }
            else if (c == '+')
            {
                result += sign * number;
                number = 0;
                sign = 1;
            }
            else if (c == '-')
            {
                result += sign * number;
                number = 0;
                sign = -1;
            }
            else if (c == '(')
            {
                //we push the result first, then sign;
                stack.Push(result);
                stack.Push(sign);
                //reset the sign and result for the value in the parenthesis
                sign = 1;
                result = 0;
            }
            else if (c == ')')
            {
                result += sign * number;
                number = 0;
                result *= stack.Pop();   //stack.pop() is the sign before the parenthesis
                result += stack.Pop();   //stack.pop() now is the result calculated before the parenthesis
            }
        }
        if (number != 0) result += sign * number;
        return result;
    }
}
```

### [1926] Nearest Exit from Entrance in Maze

Time: 2022-11-21

Difficulty: Medium (43.12%)

Tags: Unknown

广搜

事实证明，语言和代码风格也是会影响编程水平的，这思路我一早想出来，但 res++因为屎一般的大括号嵌套写错了地方，竟然一直都没有看出来

```csharp
public class Solution
{
    /// <summary>
    /// 194/194 cases passed (420 ms)
    /// Your runtime beats 62.3 % of csharp submissions
    /// Your memory usage beats 86.89 % of csharp submissions (40.5 MB)
    /// </summary>
    /// <value></value>
    private static readonly int[][] direct = new int[][] { new int[] { 0, 1 }, new int[] { 1, 0 }, new int[] { 0, -1 }, new int[] { -1, 0 } };
    public int NearestExit(char[][] maze, int[] entrance)
    {
        var rows = maze.Length;
        var cols = maze[0].Length;
        var bfs = new Queue<int[]>();
        var res = 1;
        bfs.Enqueue(entrance);
        maze[entrance[0]][entrance[1]] = '+';
        while (bfs.Count > 0)
        {
            var size = bfs.Count;
            for (int i = 0; i < size; i++)
            {
                var item = bfs.Dequeue();
                for (int j = 0; j < 4; j++)
                {
                    var newX = item[0] + direct[j][0];
                    var newY = item[1] + direct[j][1];
                    if (newX < 0 || newY < 0 || newX >= rows || newY >= cols || maze[newX][newY] == '+')
                        continue;
                    else if (newX == 0 || newX == rows - 1 || newY == 0 || newY == cols - 1)
                        return res;
                    else
                    {
                        bfs.Enqueue(new int[] { newX, newY });
                        maze[newX][newY] = '+';
                    }
                }
            }
            res++;
        }
        return -1;
    }
}
```

### [279] Perfect Squares

Time: 2022-11-22

Difficulty: Medium (52.14%)

Tags: math | dynamic-programming | breadth-first-search

```csharp
public class Solution
{
    private int getSquareNumLessThan(int n)
    {
        return (int)Math.Sqrt(n);
    }
    /// <summary>
    ///588/588 cases passed (64 ms)
    ///Your runtime beats 88.69 % of csharp submissions
    ///Your memory usage beats 34.39 % of csharp submissions (31 MB)
    /// </summary>
    /// <param name="n"></param>
    /// <returns></returns>
    public int NumSquares(int n)
    {
        var bfs = new Queue<int>();
        var res = 1;
        bfs.Enqueue(n);
        while (bfs.Count > 0)
        {
            var size = bfs.Count;
            for (int i = 0; i < size; i++)
            {
                var first = bfs.Dequeue();
                var maxSquareNum = getSquareNumLessThan(first);
                for (int j = maxSquareNum; j >= 1; j--)
                    if (first - j * j == 0)
                        return res;
                    else
                        bfs.Enqueue(first - j * j);
            }
            res++;
        }
        return n;
    }
}
```

### [36] Valid Sudoku

Time: 2022-11-23

Difficulty: Medium (56.81%)

Tags: hash-table

原来只要判定当前是否 valid 就行了，我还以为得要做出来呢 (= =!)

```csharp
public class Solution
{
    /// <summary>
    /// 507/507 cases passed (198 ms)
    /// Your runtime beats 37.95 % of csharp submissions
    /// Your memory usage beats 34.71 % of csharp submissions (41.9 MB)
    /// </summary>
    /// <param name="board"></param>
    /// <returns></returns>
    public bool IsValidSudoku(char[][] board)
    {
        var seen = new HashSet<string>();
        for (int i = 0; i < 9; ++i)
        {
            for (int j = 0; j < 9; ++j)
            {
                char number = board[i][j];
                if (number != '.')
                    if (!seen.Add($"{number} in row {i}") ||
                        !seen.Add($"{number} in column {j}") ||
                        !seen.Add($"{number} in block {i / 3}-{j / 3}"))
                        return false;
            }
        }
        return true;
    }
}
```

### [79] Word Search

Time： 2022-11-25

Difficulty: Medium (39.79%)

Tags: array | backtracking

```csharp
public class Solution
{
    private static readonly int[][] direct = new int[][] { new int[] { -1, 0 }, new int[] { 1, 0 }, new int[] { 0, 1 }, new int[] { 0, -1 } };
    private string word;
    private bool bfs(char[][] board, int x, int y, int index)
    {
        if (index == word.Length - 1)
        {
            return true;
        }
        var ch = board[x][y];
        board[x][y] = ' ';
        index++;
        for (int i = 0; i < direct.Length; i++)
        {
            var newX = x + direct[i][0];
            var newY = y + direct[i][1];
            if (newX < 0 || newY < 0 || newX >= board.Length || newY >= board[0].Length)
                continue;
            if (board[newX][newY] == word[index])
            {
                if (bfs(board, newX, newY, index))
                {
                    return true;
                }
            }
        }
        board[x][y] = ch;
        return false;
    }
    /// <summary>
    /// 84/84 cases passed (310 ms)
    /// Your runtime beats 85.78 % of csharp submissions
    /// Your memory usage beats 98.22 % of csharp submissions (39.2 MB)
    /// </summary>
    /// <param name="board"></param>
    /// <param name="word"></param>
    /// <returns></returns>
    public bool Exist(char[][] board, string word)
    {
        this.word = word;
        for (int i = 0; i < board.Length; i++)
        {
            for (int j = 0; j < board[0].Length; j++)
            {
                if (board[i][j] == word[0])
                {
                    if (bfs(board, i, j, 0))
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
```

### [2225] Find Players With Zero or One Losses

Time: 2022-11-28

Difficulty: Medium (68.97%)

Tags: Unknown

```csharp
public class Solution
{
    /// <summary>
    /// 127/127 cases passed (653 ms)
    /// Your runtime beats 96.43 % of csharp submissions
    /// Your memory usage beats 22.32 % of csharp submissions (74.3 MB)
    /// </summary>
    /// <param name="matches"></param>
    /// <returns></returns>
    public IList<IList<int>> FindWinners(int[][] matches)
    {
        var lost = new Dictionary<int, int>();
        Array.ForEach(matches, match =>
            {
                if (lost.ContainsKey(match[1]))
                    lost[match[1]]++;
                else
                    lost[match[1]] = 1;
                if (!lost.ContainsKey(match[0]))
                    lost[match[0]] = 0;
            }
        );
        var lost0 = new List<int>();
        var lost1 = new List<int>();
        foreach (var kv in lost)
        {
            switch (kv.Value)
            {
                case 0: lost0.Add(kv.Key); break;
                case 1: lost1.Add(kv.Key); break;
                default: continue;
            }
        }
        lost0.Sort();
        lost1.Sort();
        return new List<IList<int>>
        {
            lost0,
            lost1
        };
    }
}
```

### [380] Insert Delete GetRandom O(1)

Time: 2022-11-29

Difficulty: Medium (52.04%)

Tags: array | hash-table | design

```csharp
/// <summary>
/// 19/19 cases passed (342 ms)
/// Your runtime beats 91.91 % of csharp submissions
/// Your memory usage beats 63.6 % of csharp submissions (87.8 MB)
/// <see href="https://leetcode.com/problems/insert-delete-getrandom-o1/discuss/85401/Java-solution-using-a-HashMap-and-an-ArrayList-along-with-a-follow-up.-(131-ms)"/>
/// </summary>
public class RandomizedSet
{
    private List<int> nums = new();
    private Dictionary<int, int> locs = new();
    private Random random = new();

    public RandomizedSet()
    {

    }

    public bool Insert(int val)
    {
        if (locs.ContainsKey(val))
            return false;
        locs[val] = nums.Count;
        nums.Add(val);
        return true;
    }

    public bool Remove(int val)
    {
        if (!locs.ContainsKey(val))
            return false;
        var loc = locs[val];
        if (loc < nums.Count - 1)
        {
            nums[loc] = nums[^1];
            locs[nums[loc]] = loc;
        }
        nums.RemoveAt(nums.Count - 1);
        locs.Remove(val);
        return true;
    }

    public int GetRandom()
    {
        return nums[random.Next(nums.Count)];
    }
}
```

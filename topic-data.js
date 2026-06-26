window.VX_TOPIC_DATA=(function(){
const S='Pattern framing · <b>AlgoMaster</b> &nbsp;|&nbsp; Code · <b>Striver / takeUforward style</b>';
const p=(cat,label,complexity,when,insight,analogy,bugs,problems,code,trace,frames)=>({cat,label,complexity,when,insight,analogy,bugs,problems,code,trace,frames,source:S});
const tape=(items,hot,done,line,msg,labels)=>({items,hot:hot||[],done:done||[],line,msg,labels});
const mat=(matrix,hot,done,line,msg)=>({matrix,hot:hot||[],done:done||[],line,msg});
const tree=(nodes,edges,hot,done,line,msg,edgeHot)=>({tree:{nodes,edges},hot:hot||[],done:done||[],line,msg,edgeHot:edgeHot||[]});

const trieNodes=[
  {x:250,y:34,t:'*',l:'root'},{x:130,y:100,t:'a'},{x:250,y:100,t:'b'},{x:370,y:100,t:'c'},
  {x:90,y:170,t:'n'},{x:170,y:170,t:'t'},{x:250,y:170,t:'a'},{x:330,y:170,t:'a'},{x:410,y:170,t:'r'},
  {x:90,y:232,t:'t'},{x:250,y:232,t:'t'},{x:330,y:232,t:'t'}
];
const trieEdges=[[0,1],[0,2],[0,3],[1,4],[1,5],[2,6],[3,7],[3,8],[4,9],[6,10],[7,11]];

return {
tries:{
  pageTitle:'Tries - Prefix Trees, Search, StartsWith, Word Break',
  description:'Interactive trie pattern hub with vector dry-runs, Striver style C++ code, prefix search, word dictionary, word break and bit trie patterns.',
  badge:'TRIES', title:'Tries / Prefix Trees', eyebrow:'Trie Pattern Hub',
  heroTitle:'See prefixes <b>branch</b> into answers.',
  heroSub:'Build, search and reason about prefix trees with glass panels, vector dry-runs and <b>Striver-style C++</b> for the trie patterns that keep appearing in interviews.',
  topDesc:'Prefix trees compress shared starts of words. Step through insertion, search, wildcard DFS, word break and XOR bit tries with code and visuals synced together.',
  primaryCta:'Explore trie patterns', accent:'#00e5ff', rgb:'0,229,255',
  patterns:[
    p('CORE','Insert Word','O(L)','Use when many strings share prefixes and you need fast incremental insert/search.','Walk one character at a time. Missing child means create a node; the last node gets the end marker.','Like filing words in nested drawers: first letter drawer, second letter drawer, and a small flag on the final drawer.', ['Forgetting the end marker, which makes "app" indistinguishable from prefix of "apple".','Using map when alphabet is fixed and array[26] is simpler.'],['Implement Trie','Replace Words','Longest Common Prefix'],
`struct Node{ Node* link[26]{}; bool end=false; };
class Trie{
    Node* root = new Node();
public:
    void insert(string word){
        Node* node = root;
        for(char ch: word){
            int i = ch - 'a';
            if(!node->link[i]) node->link[i] = new Node();
            node = node->link[i];
        }
        node->end = true;
    }
};`,
['node = root','for each character','if child missing create it','move to child','mark end'],
[tree(trieNodes,trieEdges,[0],[],0,'Start at the root. The root stores no character; it only owns first-letter links.'),
 tree(trieNodes,trieEdges,[1,4,9],[],2,'Insert "ant": create/follow a -> n -> t. Each edge is one character.',[[0,1],[1,4],[4,9]]),
 tree(trieNodes,trieEdges,[5],[],3,'Insert "at": reuse existing a, then branch to t. Shared prefix saves space.',[[0,1],[1,5]]),
 tree(trieNodes,trieEdges,[],[9,5],4,'Mark terminal nodes. "ant" and "at" are both complete words.')]),
    p('CORE','Search Word','O(L)','Use when the full word must exist, not just a prefix.','Follow every character. The word is found only if the last node has end=true.','A route is not enough; you must arrive at a building that has a nameplate.', ['Returning true after traversal without checking end.','Treating uppercase or non-lowercase input as array indexes.'],['Implement Trie','Word Dictionary','Design Search Autocomplete'],
`bool search(string word){
    Node* node = root;
    for(char ch: word){
        int i = ch - 'a';
        if(!node->link[i]) return false;
        node = node->link[i];
    }
    return node->end;
}`,
['node = root','for each character','missing child -> false','move to child','return end marker'],
[tree(trieNodes,trieEdges,[0],[],0,'Search for "bat". Begin at root.'),
 tree(trieNodes,trieEdges,[2,6,10],[],3,'Follow b -> a -> t. Every required edge exists.',[[0,2],[2,6],[6,10]]),
 tree(trieNodes,trieEdges,[10],[],4,'The last node is terminal, so the full word exists.'),
 tree(trieNodes,trieEdges,[3,7],[],2,'For "cap", c -> a exists but p is missing, so search returns false.',[[0,3],[3,7]])]),
    p('CORE','Starts With Prefix','O(P)','Use for autocomplete, prefix filters and dictionary pruning.','Same traversal as search, but no end marker check. Reaching the prefix node is enough.','You only need to verify that a street exists, not a specific house at the end.', ['Accidentally checking end=true and rejecting valid prefixes.'],['Implement Trie','Search Suggestions System','Prefix and Suffix Search'],
`bool startsWith(string prefix){
    Node* node = root;
    for(char ch: prefix){
        int i = ch - 'a';
        if(!node->link[i]) return false;
        node = node->link[i];
    }
    return true;
}`,
['node = root','for each char in prefix','missing child -> false','move to child','return true'],
[tree(trieNodes,trieEdges,[0],[],0,'Prefix query "ca": start at root.'),
 tree(trieNodes,trieEdges,[3,7],[],3,'Follow c -> a. We do not need a terminal marker.',[[0,3],[3,7]]),
 tree(trieNodes,trieEdges,[7],[],4,'Reached the prefix node, so startsWith("ca") is true.'),
 tree(trieNodes,trieEdges,[8],[],2,'Prefix "cr" exists only if the r edge is present; missing edges fail immediately.')]),
    p('DFS','Wildcard Search','O(26^dots * L)','Use when query can contain "." meaning any one character.','Normal characters follow one edge; dot branches DFS over every existing child.','A dot is a fork in a maze: try every open corridor, but keep the remaining suffix fixed.', ['Branching over all 26 slots without null checks.','Returning true before consuming the whole pattern.'],['Design Add and Search Words Data Structure','Word Search II'],
`bool dfs(Node* node, string& s, int pos){
    if(pos == s.size()) return node->end;
    if(s[pos] != '.'){
        Node* nxt = node->link[s[pos]-'a'];
        return nxt && dfs(nxt, s, pos+1);
    }
    for(Node* child: node->link)
        if(child && dfs(child, s, pos+1)) return true;
    return false;
}`,
['if pattern consumed return end','normal char follows one child','dot branches over children','first true branch wins','all fail -> false'],
[tree(trieNodes,trieEdges,[0],[],0,'Search pattern ".at": the first character is a wildcard.'),
 tree(trieNodes,trieEdges,[1,2,3],[],2,'Dot tries every existing first-letter child: a, b, c.'),
 tree(trieNodes,trieEdges,[6,10],[],3,'The b -> a -> t branch satisfies the rest of the pattern.',[[0,2],[2,6],[6,10]]),
 tree(trieNodes,trieEdges,[10],[],0,'Pattern consumed at a terminal node, so the search succeeds.')]),
    p('DP + TRIE','Word Break With Trie','O(n * maxLen)','Use when a string must be segmented into dictionary words.','DP marks reachable start indexes. From each reachable index, walk the trie forward and mark every terminal end.','You place checkpoints only where a dictionary word ends; the trie tells you which next checkpoints are reachable.', ['Continuing from dp[i]=false starts.','Not stopping trie walk when a child is missing.'],['Word Break','Concatenated Words','Extra Characters in a String'],
`bool wordBreak(string s, vector<string>& dict){
    Trie tr; for(string& w: dict) tr.insert(w);
    vector<int> dp(s.size()+1); dp[0] = 1;
    for(int i=0;i<s.size();i++){
        if(!dp[i]) continue;
        Node* node = tr.root;
        for(int j=i;j<s.size();j++){
            int c = s[j]-'a';
            if(!node->link[c]) break;
            node = node->link[c];
            if(node->end) dp[j+1] = 1;
        }
    }
    return dp[s.size()];
}`,
['dp[0] = true','skip unreachable starts','walk trie from i','terminal node marks dp[j+1]','answer dp[n]'],
[tape(['0','l','e','e','t','c','o','d','e'],[0],[],0,'dp[0] is true: the empty prefix is segmented.'),
 tape(['0','l','e','e','t','c','o','d','e'],[1,2,3,4],[4],3,'From index 0, "leet" is a terminal trie path, so dp[4]=true.'),
 tape(['0','l','e','e','t','c','o','d','e'],[5,6,7,8],[4,8],3,'From index 4, "code" ends at dp[8].'),
 tape(['0','l','e','e','t','c','o','d','e'],[],[0,4,8],4,'dp[n] is true, so the string can be segmented.')]),
    p('BIT TRIE','Maximum XOR Pair','O(n * 32)','Use for max XOR queries on integers.','Insert bits into a binary trie. For each number, greedily walk the opposite bit to maximize XOR.','At every bit, choose the road that turns on the current XOR bit if that road exists.', ['Using signed shift bugs; iterate from 31 or 30 consistently for constraints.','Querying before at least one number is inserted.'],['Maximum XOR of Two Numbers in an Array','Max XOR Queries','Count Pairs With XOR in Range'],
`int findMaximumXOR(vector<int>& nums){
    BitTrie tr; int ans = 0;
    for(int x: nums){
        tr.insert(x);
        int cur = 0, node = 0;
        for(int b=31;b>=0;b--){
            int bit = (x>>b)&1, want = bit^1;
            if(tr.has(node, want)){
                cur |= (1<<b);
                node = tr.go(node, want);
            }else node = tr.go(node, bit);
        }
        ans = max(ans, cur);
    }
    return ans;
}`,
['insert number','for bit high to low','prefer opposite bit','set xor bit if found','update answer'],
[tape(['5','25','10','2'],[0],[],0,'Insert numbers into a bit trie. Query each number against previous paths.'),
 tape(['101','11001'],[0,1],[],2,'For 5 (00101), prefer opposite bits from 25 (11001).'),
 tape(['1','1','1','0','0'],[0,1,2],[],3,'Every opposite choice that exists turns on a high-value XOR bit.'),
 tape(['max','xor','=','28'],[],[0,1,2,3],4,'The best pair gives maximum XOR 28.')])
  ]},

backtracking:{
  pageTitle:'Backtracking - Subsets, Permutations, Combination Sum, N-Queens',
  description:'Interactive backtracking hub with vector recursion trees, Striver style C++ and step-by-step include/exclude, permutations, combinations and board search.',
  badge:'BACKTRACK', title:'Backtracking', eyebrow:'Backtracking Pattern Hub',
  heroTitle:'Explore, undo, <b>try again</b>.',
  heroSub:'See recursive choice trees unfold as vector diagrams while the matching <b>Striver-style C++</b> line lights up: subsets, permutations, combination sum, N-Queens and word search.',
  topDesc:'Backtracking is controlled brute force: make a choice, recurse, undo the choice, and try the next candidate.',
  primaryCta:'Explore backtracking', accent:'#ff5acd', rgb:'255,90,205',
  patterns:[
    p('SUBSETS','Subsets Include / Exclude','O(2^n)','Use when every element has two choices: take it or skip it.','At index i, branch into exclude and include. Push a result at the leaf.','A binary decision tree where each level asks one yes/no question.', ['Forgetting to pop after include branch.','Pushing only non-empty subsets when empty is valid.'],['Subsets','Subsets II','Power Set'],
`void dfs(int i, vector<int>& nums, vector<int>& path, vector<vector<int>>& ans){
    if(i == nums.size()){
        ans.push_back(path);
        return;
    }
    dfs(i+1, nums, path, ans);        // do not take
    path.push_back(nums[i]);          // take
    dfs(i+1, nums, path, ans);
    path.pop_back();                  // undo
}`,
['if leaf push path','exclude nums[i]','take nums[i]','recurse include','undo choice'],
[tree([{x:260,y:35,t:'[]'},{x:150,y:100,t:'skip 1'},{x:370,y:100,t:'take 1'},{x:90,y:172,t:'[]'},{x:210,y:172,t:'[2]'},{x:320,y:172,t:'[1]'},{x:430,y:172,t:'[1,2]'}],[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],[0],[],1,'Start with an empty path. Each level decides one number.'),
 tree([{x:260,y:35,t:'[]'},{x:150,y:100,t:'skip 1'},{x:370,y:100,t:'take 1'},{x:90,y:172,t:'[]'},{x:210,y:172,t:'[2]'},{x:320,y:172,t:'[1]'},{x:430,y:172,t:'[1,2]'}],[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],[1,3],[],1,'Exclude branch keeps the path unchanged.',[[0,1],[1,3]]),
 tree([{x:260,y:35,t:'[]'},{x:150,y:100,t:'skip 1'},{x:370,y:100,t:'take 1'},{x:90,y:172,t:'[]'},{x:210,y:172,t:'[2]'},{x:320,y:172,t:'[1]'},{x:430,y:172,t:'[1,2]'}],[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],[2,6],[],2,'Include branch pushes 1, then can include 2.',[[0,2],[2,6]]),
 tape(['[]','[2]','[1]','[1,2]'],[],[0,1,2,3],0,'Every leaf becomes one subset.')]),
    p('PERMUTE','Permutations With Used Array','O(n! * n)','Use when order matters and every element is used once.','At each depth, try every unused element, mark it, recurse, then unmark.','Seats at a table: fill one seat with any unused person, then move to the next seat.', ['Not unmarking used[i] after recursion.','Using a set unnecessarily when indexes already disambiguate duplicates.'],['Permutations','Permutations II'],
`void dfs(vector<int>& nums, vector<int>& path, vector<int>& used, vector<vector<int>>& ans){
    if(path.size() == nums.size()){
        ans.push_back(path);
        return;
    }
    for(int i=0;i<nums.size();i++){
        if(used[i]) continue;
        used[i] = 1; path.push_back(nums[i]);
        dfs(nums, path, used, ans);
        path.pop_back(); used[i] = 0;
    }
}`,
['if full path push','loop candidates','skip used','choose and recurse','undo'],
[tape(['1','2','3'],[0],[],3,'Pick 1 for the first position and mark it used.',{0:'used'}),
 tape(['1','2','3'],[1],[],3,'Next depth can pick any unused number, here 2.'),
 tape(['1','2','3'],[2],[0,1],0,'Path [1,2,3] is full, so store it.'),
 tape(['1','2','3'],[1],[],4,'Pop 3, unmark it, and continue trying alternatives.')]),
    p('COMBINATION','Combination Sum','exponential','Use when candidates can be reused and target must become exactly zero.','Stay on the same index when taking a candidate; move forward when skipping it.','Buying items with unlimited copies until the remaining budget hits zero.', ['Advancing index after take when reuse is allowed.','Not stopping when target becomes negative.'],['Combination Sum','Combination Sum II','Combinations'],
`void solve(int i, int target, vector<int>& a, vector<int>& path, vector<vector<int>>& ans){
    if(target == 0){ ans.push_back(path); return; }
    if(i == a.size() || target < 0) return;
    path.push_back(a[i]);
    solve(i, target - a[i], a, path, ans);      // take again
    path.pop_back();
    solve(i+1, target, a, path, ans);           // skip
}`,
['target zero -> answer','invalid stop','take candidate','reuse same i','skip to i+1'],
[tape(['2','3','6','7'],[0],[],2,'Target 7. Take 2 and stay on index 0 because reuse is allowed.'),
 tape(['2','2','3'],[2],[0,1],3,'Remaining target reaches 3; take candidate 3.'),
 tape(['2','2','3'],[],[0,1,2],0,'Target becomes zero, so [2,2,3] is a valid combination.'),
 tape(['7'],[0],[],4,'The skip branch eventually tries 7 directly as another answer.')]),
    p('BOARD','N-Queens','O(n!)','Use when choices must satisfy row/column/diagonal constraints.','Place one queen per column. Track row, upper diagonal, and lower diagonal occupancy in O(1).','A security grid: each queen claims her row and both diagonals, so future placements avoid those laser lines.', ['Checking the whole board every time instead of row/diag arrays.','Wrong diagonal indexes: row+col and n-1+col-row.'],['N-Queens','N-Queens II'],
`void solve(int col, int n, vector<string>& board){
    if(col == n){ ans.push_back(board); return; }
    for(int row=0; row<n; row++){
        if(leftRow[row] || upper[n-1+col-row] || lower[row+col]) continue;
        board[row][col] = 'Q';
        leftRow[row] = upper[n-1+col-row] = lower[row+col] = 1;
        solve(col+1, n, board);
        board[row][col] = '.';
        leftRow[row] = upper[n-1+col-row] = lower[row+col] = 0;
    }
}`,
['if all columns solved','try every row','skip attacked cells','place queen and mark','undo marks'],
[mat([['.','.','.','.'],['.','.','.','.'],['.','.','.','.'],['.','.','.','.']],['1,0'],[],3,'Try placing a queen in column 0, row 1.'),
 mat([['.','.','.','.'],['Q','.','.','.'],['.','.','.','.'],['.','.','.','.']],['1,0','1,1','0,1','2,1'],['1,0'],2,'In the next column, attacked row/diagonal cells are skipped.'),
 mat([['.','.','Q','.'],['Q','.','.','.'],['.','.','.','Q'],['.','Q','.','.']],[],['0,2','1,0','2,3','3,1'],0,'A complete board with 4 queens is stored.'),
 mat([['.','.','.','.'],['.','.','.','.'],['.','.','.','.'],['.','.','.','.']],[],[],4,'Backtrack: remove the queen and try the next safe row.')]),
    p('GRID DFS','Word Search','O(m*n*4^L)','Use when a word must be traced through adjacent board cells without reusing a cell.','Try every start cell. DFS consumes one character at a time, marks the current cell, explores 4 directions, then restores.','Tracing a word through a letter maze while dropping breadcrumbs you pick back up on return.', ['Not restoring visited cells.','Allowing diagonal moves when only 4-direction moves are allowed.'],['Word Search','Word Search II'],
`bool dfs(int r,int c,int k){
    if(k == word.size()) return true;
    if(r<0 || c<0 || r==m || c==n || board[r][c] != word[k]) return false;
    char old = board[r][c];
    board[r][c] = '#';
    bool ok = dfs(r+1,c,k+1) || dfs(r-1,c,k+1) || dfs(r,c+1,k+1) || dfs(r,c-1,k+1);
    board[r][c] = old;
    return ok;
}`,
['word consumed -> true','bounds/char guard','mark visited','try four directions','restore and return'],
[mat([['A','B','C'],['S','F','C'],['A','D','E']],['0,0'],[],2,'Match A at (0,0), then mark it visited.'),
 mat([['A','B','C'],['S','F','C'],['A','D','E']],['0,1'],['0,0'],3,'Move right to B for the next character.'),
 mat([['A','B','C'],['S','F','C'],['A','D','E']],['0,2','1,2','2,2'],['0,0','0,1'],3,'Continue through C -> C -> E.'),
 mat([['A','B','C'],['S','F','C'],['A','D','E']],[],[],4,'Restore cells while returning so other starts can reuse them.')]),
    p('DEDUP','Subsets II / Duplicate Skip','O(2^n)','Use when input has duplicates but output subsets must be unique.','Sort first. At a recursion level, skip nums[i] if it equals nums[i-1] and i is not the start.','Only the first identical ticket at each gate gets to open a new branch.', ['Skipping duplicates globally, which loses valid counts.','Forgetting to sort before duplicate skip.'],['Subsets II','Combination Sum II'],
`void dfs(int start, vector<int>& nums, vector<int>& path){
    ans.push_back(path);
    for(int i=start;i<nums.size();i++){
        if(i > start && nums[i] == nums[i-1]) continue;
        path.push_back(nums[i]);
        dfs(i+1, nums, path);
        path.pop_back();
    }
}`,
['push current path','loop from start','skip same value at same level','choose','undo'],
[tape(['1','2','2'],[0],[],0,'After sorting, start from an empty path and push it.'),
 tape(['1','2','2'],[1],[],3,'Choose the first 2 at this level.'),
 tape(['1','2','2'],[2],[1],2,'When i > start and nums[i]==nums[i-1], skip the second 2 branch.'),
 tape(['[]','[1]','[2]','[1,2]','[2,2]'],[],[0,1,2,3,4],0,'Unique subsets remain, while valid repeated counts can still appear deeper.')])
  ]},

greedy:{
  pageTitle:'Greedy - Intervals, Jump Game, Gas Station, Huffman, Activity Selection',
  description:'Interactive greedy pattern hub with exchange argument intuition, Striver style C++ and vector animations.',
  badge:'GREEDY', title:'Greedy', eyebrow:'Greedy Pattern Hub',
  heroTitle:'Make the local move that <b>survives proof</b>.',
  heroSub:'Greedy is not guessing. Each pattern here shows the local rule, why it is safe, and the <b>Striver-style C++</b> that implements it.',
  topDesc:'Sort or scan, keep the best local state, and rely on an exchange argument that any optimal answer can be transformed to include your choice.',
  primaryCta:'Explore greedy patterns', accent:'#5dff8f', rgb:'93,255,143',
  patterns:[
    p('INTERVAL','Activity Selection','O(n log n)','Use when you need the maximum number of non-overlapping intervals.','Sort by end time and always take the activity that finishes first.','Leaving the room as early as possible gives every future meeting the most space.', ['Sorting by start time.','Using < instead of >= when touching intervals are allowed.'],['N Meetings in One Room','Non-overlapping Intervals'],
`int maxMeetings(vector<int>& start, vector<int>& end){
    vector<pair<int,int>> a;
    for(int i=0;i<start.size();i++) a.push_back({end[i], start[i]});
    sort(a.begin(), a.end());
    int cnt = 0, lastEnd = -1;
    for(auto [e,s]: a){
        if(s > lastEnd){
            cnt++;
            lastEnd = e;
        }
    }
    return cnt;
}`,
['build end,start pairs','sort by end','scan intervals','take if compatible','update lastEnd'],
[tape(['1-2','3-4','0-6','5-7','8-9'],[0],[],1,'Sort activities by finishing time.'),
 tape(['1-2','3-4','0-6','5-7','8-9'],[0], [0],3,'Take 1-2 first because it ends earliest.'),
 tape(['1-2','3-4','0-6','5-7','8-9'],[2],[0,1],3,'Skip 0-6 because it overlaps the last chosen meeting.'),
 tape(['1-2','3-4','5-7','8-9'],[],[0,1,2,3],4,'The chosen set is maximal by the earliest-finish exchange rule.')]),
    p('REACH','Jump Game','O(n)','Use when each index gives maximum jump length and you only need reachability.','Maintain the farthest reachable index. If current index passes farthest, you are stuck.','A moving safety frontier: every jump extends how far the bridge reaches.', ['Doing DP when a single farthest pointer is enough.','Updating farthest after checking unreachable in the wrong order.'],['Jump Game','Jump Game II'],
`bool canJump(vector<int>& nums){
    int far = 0;
    for(int i=0;i<nums.size();i++){
        if(i > far) return false;
        far = max(far, i + nums[i]);
    }
    return true;
}`,
['far = 0','scan i','if i > far fail','extend farthest','success'],
[tape(['2','3','1','1','4'],[0],[],0,'Start at index 0. far = 0.'),
 tape(['2','3','1','1','4'],[1],[0],3,'From index 0, far reaches 2; index 1 extends far to 4.'),
 tape(['2','3','1','1','4'],[4],[0,1,2,3],4,'The last index is within far, so the array is reachable.'),
 tape(['3','2','1','0','4'],[4],[0,1,2,3],2,'If i becomes greater than far, return false.')]),
    p('BALANCE','Gas Station','O(n)','Use when you need a circular start point with gas-cost deltas.','If tank drops below zero at i, no station between start and i can be the answer. Restart at i+1.','If a route segment bankrupts you, starting later inside that failed segment cannot fix the earlier debt.', ['Not checking total gas >= total cost.','Restarting at i instead of i+1.'],['Gas Station'],
`int canCompleteCircuit(vector<int>& gas, vector<int>& cost){
    int total = 0, tank = 0, start = 0;
    for(int i=0;i<gas.size();i++){
        int diff = gas[i] - cost[i];
        total += diff; tank += diff;
        if(tank < 0){
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
}`,
['track total and tank','add station delta','if tank negative','restart after i','validate total'],
[tape(['-2','-2','-2','+3','+3'],[0],[],1,'Convert each station to gas-cost delta.'),
 tape(['-2','-2','-2','+3','+3'],[0],[],2,'Tank is negative at station 0, so starts up to 0 fail.'),
 tape(['-2','-2','-2','+3','+3'],[3],[],3,'Restart after failed prefix; later positives rebuild tank.'),
 tape(['start','3'],[],[1],4,'If total delta is non-negative, the final start works.')]),
    p('SCHEDULE','Minimum Platforms','O(n log n)','Use for minimum rooms/platforms needed for arrival and departure times.','Sort arrivals and departures. Arrival before next departure needs one more platform; otherwise free one.','Count simultaneous trains by sweeping time from left to right.', ['Sorting pairs instead of independent arrival/departure arrays for this pattern.','Mishandling equal times per problem convention.'],['Minimum Platforms','Meeting Rooms II'],
`int findPlatform(vector<int>& arr, vector<int>& dep){
    sort(arr.begin(), arr.end());
    sort(dep.begin(), dep.end());
    int i=0,j=0,cur=0,best=0,n=arr.size();
    while(i<n && j<n){
        if(arr[i] <= dep[j]) cur++, best=max(best,cur), i++;
        else cur--, j++;
    }
    return best;
}`,
['sort arrivals/departures','two pointers','arrival -> need platform','departure -> free platform','best overlap'],
[tape(['900A','940A','950A','1100D'],[0],[],2,'First arrival needs one platform.'),
 tape(['900A','940A','950A','1100D'],[1,2],[],2,'More arrivals before the next departure increase active platforms.'),
 tape(['1100D','1120D','1130D'],[0],[],3,'A departure frees one platform.'),
 tape(['best','=','3'],[],[2],4,'Maximum active count is the answer.')]),
    p('HEAP','Huffman Coding','O(n log n)','Use when repeatedly combining two smallest weights.','Always merge the two minimum frequencies; push their sum back.','The cheapest leaves should be deepest, so merge small weights first.', ['Using a max heap accidentally.','Forgetting to push merged sum back.'],['Huffman Encoding','Connect N Ropes with Minimum Cost'],
`int minCost(vector<int>& ropes){
    priority_queue<int, vector<int>, greater<int>> pq(ropes.begin(), ropes.end());
    int cost = 0;
    while(pq.size() > 1){
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        cost += a + b;
        pq.push(a + b);
    }
    return cost;
}`,
['min-heap of weights','pop smallest a','pop smallest b','add merge cost','push sum back'],
[tape(['2','3','4','6'],[0,1],[],1,'Pop the two smallest weights, 2 and 3.'),
 tape(['5','4','6'],[0],[],4,'Merge cost 5 and push it back.'),
 tape(['4','5','6'],[0,1],[],2,'Again merge the two smallest remaining weights.'),
 tape(['total','29'],[],[1],4,'Repeating the locally cheapest merge gives minimum total cost.')]),
    p('STRING','Partition Labels','O(n)','Use when each character must appear in at most one partition.','Precompute last occurrence. Expand current partition end to the farthest last occurrence of chars seen.','A segment cannot close until every character inside has had its final appearance.', ['Cutting at first repeated character.','Not precomputing last index.'],['Partition Labels'],
`vector<int> partitionLabels(string s){
    vector<int> last(26);
    for(int i=0;i<s.size();i++) last[s[i]-'a'] = i;
    vector<int> ans;
    int start = 0, end = 0;
    for(int i=0;i<s.size();i++){
        end = max(end, last[s[i]-'a']);
        if(i == end){
            ans.push_back(end - start + 1);
            start = i + 1;
        }
    }
    return ans;
}`,
['record last positions','scan string','extend segment end','cut when i == end','start next segment'],
[tape(['a','b','a','c','c'],[0],[],1,'Last occurrence map says a ends at index 2.'),
 tape(['a','b','a','c','c'],[0,1,2],[],2,'Segment end expands to cover all chars seen so far.'),
 tape(['a','b','a','c','c'],[],[0,1,2],3,'At i=end, close the partition of length 3.'),
 tape(['a','b','a','c','c'],[],[3,4],3,'Next partition closes after the last c.')])
  ]},

intervals:{
  pageTitle:'Intervals - Merge, Insert, Erase Overlap, Meeting Rooms',
  description:'Interactive intervals hub with vector timelines, Striver style C++ and core sorting/scan patterns.',
  badge:'INTERVALS', title:'Intervals', eyebrow:'Interval Pattern Hub',
  heroTitle:'Sort ranges. <b>Scan once.</b>',
  heroSub:'Intervals become predictable after sorting. Watch overlaps, gaps and active counts move across vector timelines with concise <b>Striver-style C++</b>.',
  topDesc:'Most interval problems are one of three moves: sort by start/end, merge compatible ranges, or sweep active endpoints.',
  primaryCta:'Explore interval patterns', accent:'#ff9f0a', rgb:'255,159,10',
  patterns:[
    p('MERGE','Merge Overlapping Intervals','O(n log n)','Use when overlapping ranges should collapse into disjoint ranges.','Sort by start. If next.start <= last.end, extend last.end; otherwise start a new interval.','Paint strokes on a line: touching wet paint blends into one longer stroke.', ['Forgetting to sort.','Using < when closed intervals that touch should merge.'],['Merge Intervals'],
`vector<vector<int>> merge(vector<vector<int>>& intervals){
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> ans;
    for(auto &in: intervals){
        if(ans.empty() || in[0] > ans.back()[1])
            ans.push_back(in);
        else
            ans.back()[1] = max(ans.back()[1], in[1]);
    }
    return ans;
}`,
['sort by start','scan intervals','gap -> push new','overlap -> extend end','return merged'],
[tape(['1-3','2-6','8-10','15-18'],[0],[],0,'Sort intervals by start time.'),
 tape(['1-3','2-6','8-10','15-18'],[1],[0],3,'2-6 overlaps 1-3, so extend the current end to 6.'),
 tape(['1-6','8-10','15-18'],[1],[0],2,'8 starts after 6, so it begins a new merged block.'),
 tape(['1-6','8-10','15-18'],[],[0,1,2],4,'The final list is disjoint.')]),
    p('INSERT','Insert Interval','O(n)','Use when intervals are already sorted and non-overlapping.','Copy intervals before the new one, merge all overlaps with the new one, then copy the rest.','Slide a new booking into a calendar, stretching it across every conflict it touches.', ['Sorting again unnecessarily.','Appending the new interval before fully merging overlaps.'],['Insert Interval'],
`vector<vector<int>> insert(vector<vector<int>>& a, vector<int>& x){
    vector<vector<int>> ans; int i = 0, n = a.size();
    while(i<n && a[i][1] < x[0]) ans.push_back(a[i++]);
    while(i<n && a[i][0] <= x[1]){
        x[0] = min(x[0], a[i][0]);
        x[1] = max(x[1], a[i][1]);
        i++;
    }
    ans.push_back(x);
    while(i<n) ans.push_back(a[i++]);
    return ans;
}`,
['copy before interval','merge overlaps','expand new start/end','push merged new','copy tail'],
[tape(['1-2','3-5','6-7','8-10'],[1,2],[],1,'New interval 4-8 overlaps 3-5 and 6-7.'),
 tape(['1-2','3-8','8-10'],[1],[],2,'Expand the new interval to cover every overlap.'),
 tape(['1-2','3-10'],[1],[],2,'If 8-10 touches/overlaps, merge it too.'),
 tape(['1-2','3-10'],[],[0,1],4,'Copy non-overlapping tail after the merged insert.')]),
    p('ERASE','Erase Overlap Intervals','O(n log n)','Use when removing the fewest intervals to make the rest non-overlapping.','Sort by end time, keep intervals that start after the last kept end, count the rest removed.','Keep the meeting that frees the room earliest; every conflict you skip is a removal.', ['Sorting by start and keeping long intervals.','Counting kept instead of removed incorrectly.'],['Non-overlapping Intervals'],
`int eraseOverlapIntervals(vector<vector<int>>& a){
    sort(a.begin(), a.end(), [](auto& x, auto& y){ return x[1] < y[1]; });
    int removed = 0, end = INT_MIN;
    for(auto &in: a){
        if(in[0] >= end) end = in[1];
        else removed++;
    }
    return removed;
}`,
['sort by end','end = -inf','keep compatible','overlap -> remove','return removed'],
[tape(['1-2','2-3','1-3','3-4'],[0],[],0,'Sort by ending time, not start.'),
 tape(['1-2','2-3','1-3','3-4'],[0,1],[0],2,'Keep 1-2, then 2-3 because it starts at the last end.'),
 tape(['1-2','2-3','1-3','3-4'],[2],[0,1],3,'1-3 overlaps the kept end, so remove it.'),
 tape(['1-2','2-3','3-4'],[],[0,1,2],4,'Removed count is minimal by earliest finish greediness.')]),
    p('ROOMS','Meeting Rooms II','O(n log n)','Use when you need minimum rooms for all meetings.','Sort starts and ends independently. A start before next end opens a room; otherwise one room frees.','Count how many meetings are live at each event time.', ['Pair-sorting intervals and losing sweep simplicity.','Wrong tie handling for end == start.'],['Meeting Rooms II','Minimum Platforms'],
`int minMeetingRooms(vector<vector<int>>& a){
    vector<int> st, en;
    for(auto &x: a) st.push_back(x[0]), en.push_back(x[1]);
    sort(st.begin(), st.end()); sort(en.begin(), en.end());
    int i=0,j=0,rooms=0,best=0;
    while(i<st.size()){
        if(st[i] < en[j]) rooms++, best=max(best, rooms), i++;
        else rooms--, j++;
    }
    return best;
}`,
['split starts/ends','sort both','start before end -> room++','else room--','best rooms'],
[tape(['0S','5S','10S','15E','20E','30E'],[0],[],2,'First start opens room 1.'),
 tape(['0S','5S','10S','15E'],[1,2],[],2,'Starts before the next end increase active room count.'),
 tape(['15E','20E','30E'],[0],[],3,'When an end comes first, a room frees.'),
 tape(['best','=','3'],[],[2],4,'Peak active rooms is the answer.')]),
    p('ARROWS','Minimum Arrows to Burst Balloons','O(n log n)','Use for intervals where one point can cover overlapping intervals.','Sort by end. Shoot at the earliest end; every balloon starting before that point is covered.','Place the pin as far left as possible while still hitting the first balloon.', ['Sorting by start and choosing unstable points.','Using > versus >= depending on closed interval statement.'],['Minimum Number of Arrows to Burst Balloons'],
`int findMinArrowShots(vector<vector<int>>& p){
    sort(p.begin(), p.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int arrows = 0; long long shot = LLONG_MIN;
    for(auto &x: p){
        if(x[0] > shot){
            arrows++;
            shot = x[1];
        }
    }
    return arrows;
}`,
['sort by end','shot = -inf','new arrow if start > shot','shoot at end','return arrows'],
[tape(['1-6','2-8','7-12','10-16'],[0],[],0,'Sort balloons by right end.'),
 tape(['1-6','2-8'],[0,1],[],3,'Shoot at 6; it also bursts 2-8 because 2 <= 6.'),
 tape(['7-12','10-16'],[2],[],2,'7 starts after shot 6, so a new arrow is needed.'),
 tape(['arrows','=','2'],[],[2],4,'Earliest-end shots minimize arrow count.')]),
    p('SWEEP','Employee Free Time','O(n log n)','Use when multiple sorted schedules need common gaps.','Flatten intervals, sort by start, merge busy time, and gaps between merged busy blocks are free.','Put everyone busy on one timeline; free time is the empty space between blocks.', ['Checking gaps inside each employee separately.','Not merging overlapping busy intervals first.'],['Employee Free Time'],
`vector<vector<int>> employeeFreeTime(vector<vector<int>>& busy){
    sort(busy.begin(), busy.end());
    vector<vector<int>> merged, freeTime;
    for(auto &in: busy){
        if(merged.empty() || in[0] > merged.back()[1]) merged.push_back(in);
        else merged.back()[1] = max(merged.back()[1], in[1]);
    }
    for(int i=1;i<merged.size();i++)
        freeTime.push_back({merged[i-1][1], merged[i][0]});
    return freeTime;
}`,
['sort all busy intervals','merge overlaps','scan merged busy','gap is free time','return gaps'],
[tape(['1-3','2-4','6-7','9-12'],[0,1],[],1,'Merge overlapping busy intervals first.'),
 tape(['1-4','6-7','9-12'],[0,1],[],3,'Gap between 4 and 6 is common free time.'),
 tape(['1-4','6-7','9-12'],[1,2],[],3,'Gap between 7 and 9 is another free block.'),
 tape(['4-6','7-9'],[],[0,1],4,'Return gaps between merged busy intervals.')])
  ]},

bit:{
  pageTitle:'Bit Manipulation - XOR, Masks, Subsets, Single Number',
  description:'Interactive bit manipulation hub with vector bit lanes, Striver style C++ and core XOR/mask templates.',
  badge:'BITS', title:'Bit Manipulation', eyebrow:'Bit Pattern Hub',
  heroTitle:'Turn state into <b>bits</b>.',
  heroSub:'Masks, XOR and set bits become easier when you can see the lanes flip. This hub pairs vector bit animations with standard <b>Striver-style C++</b> templates.',
  topDesc:'Bit manipulation compresses boolean state and parity into integers. Most patterns rely on XOR cancellation, masks, and repeated low-bit removal.',
  primaryCta:'Explore bit patterns', accent:'#bf5af2', rgb:'191,90,242',
  patterns:[
    p('XOR','Single Number','O(n)','Use when every number appears twice except one.','XOR cancels equal values: x^x=0 and x^0=x.','Pairs erase each other, leaving only the unpaired value.',['Using sum can overflow.','Forgetting XOR is order independent.'],['Single Number'],
`int singleNumber(vector<int>& nums){
    int xr = 0;
    for(int x: nums) xr ^= x;
    return xr;
}`,
['xr = 0','xor each number','pairs cancel','return xr'],
[tape(['4','1','2','1','2'],[0],[],1,'xr ^= 4 gives 4.'),
 tape(['4','1','2','1','2'],[1,3],[],2,'The two 1 values cancel in XOR.'),
 tape(['4','1','2','1','2'],[2,4],[],2,'The two 2 values cancel too.'),
 tape(['answer','4'],[],[1],3,'Only 4 remains.')]),
    p('XOR','Two Single Numbers','O(n)','Use when exactly two numbers appear once and all others appear twice.','XOR all numbers to get a^b. Use the rightmost set bit to split numbers into two groups.','A differing bit separates the two unique numbers into different buckets.',['Using a bit that is not set in a^b.','Forgetting to XOR within each bucket separately.'],['Single Number III'],
`vector<int> singleNumber(vector<int>& nums){
    long xr = 0;
    for(int x: nums) xr ^= x;
    long mask = xr & -xr;
    int a = 0, b = 0;
    for(int x: nums){
        if(x & mask) a ^= x;
        else b ^= x;
    }
    return {a,b};
}`,
['xor all -> a^b','mask rightmost set bit','split by mask','xor bucket A/B','return uniques'],
[tape(['1','2','1','3','2','5'],[0,1,2,3,4,5],[],0,'XOR all numbers. Duplicates cancel, leaving 3^5.'),
 tape(['3^5','=', '110'],[2],[],1,'Pick the rightmost set bit from 3^5.'),
 tape(['1','1','3'],[2],[],3,'Bucket 1 cancels duplicates and leaves 3.'),
 tape(['2','2','5'],[2],[],4,'Bucket 2 cancels duplicates and leaves 5.')]),
    p('MASK','Check / Set / Clear Bit','O(1)','Use for constant-time boolean flags inside one integer.','Build mask = 1 << bit. OR sets, AND with inverse clears, AND tests.','Each bit is a tiny switch in a row of switches.',['Using pow(2,k) instead of shifting.','Shift overflow when k is too large for int.'],['Bit Basics','Power of Two'],
`bool isSet(int n, int k){ return n & (1<<k); }
int setBit(int n, int k){ return n | (1<<k); }
int clearBit(int n, int k){ return n & ~(1<<k); }
int toggleBit(int n, int k){ return n ^ (1<<k); }`,
['test with AND','set with OR','clear with AND inverse','toggle with XOR'],
[tape(['0','1','0','1'],[1],[],0,'To test bit 1, AND with mask 0010.'),
 tape(['0','1','1','1'],[2],[],1,'OR with 0100 sets bit 2.'),
 tape(['0','0','1','1'],[1],[],2,'AND with inverse mask clears bit 1.'),
 tape(['0','0','0','1'],[2],[],3,'XOR toggles bit 2.')]),
    p('COUNT','Count Set Bits','O(number of set bits)','Use when you need population count without checking every bit.','Brian Kernighan trick repeatedly removes the lowest set bit: n &= n-1.','Each operation knocks off the lowest glowing light.',['Looping while n>0 fails for signed negative values in some contexts.','Counting bits with string conversion.'],['Number of 1 Bits','Counting Bits'],
`int countSetBits(int n){
    int cnt = 0;
    while(n){
        n = n & (n - 1);
        cnt++;
    }
    return cnt;
}`,
['cnt = 0','while n','drop lowest set bit','cnt++','return cnt'],
[tape(['1','1','0','1','0'],[3],[],2,'n & (n-1) removes the lowest set bit.'),
 tape(['1','1','0','0','0'],[1],[],2,'Repeat to remove the next lowest set bit.'),
 tape(['1','0','0','0','0'],[0],[],3,'Each removal increments count.'),
 tape(['count','=','3'],[],[2],4,'When n becomes zero, count is the number of set bits.')]),
    p('SUBSETS','Generate Subsets By Mask','O(2^n * n)','Use when n is small and each subset can be represented by a mask.','For mask from 0 to 2^n-1, include nums[i] if bit i is set.','A mask is a checklist: 1 means take the item, 0 means skip it.',['Using 1<<n when n may exceed int width.','Mixing bit order with output order.'],['Subsets','Power Set'],
`vector<vector<int>> subsets(vector<int>& nums){
    int n = nums.size();
    vector<vector<int>> ans;
    for(int mask=0; mask < (1<<n); mask++){
        vector<int> cur;
        for(int i=0;i<n;i++)
            if(mask & (1<<i)) cur.push_back(nums[i]);
        ans.push_back(cur);
    }
    return ans;
}`,
['loop all masks','start subset','check each bit','include if set','push subset'],
[tape(['0','0','0'],[],[],0,'Mask 000 chooses empty subset.'),
 tape(['1','0','1'],[0,2],[],3,'Mask 101 includes nums[0] and nums[2].'),
 tape(['1','1','1'],[0,1,2],[],4,'Every mask maps to exactly one subset.'),
 tape(['2^n','subsets'],[],[0,1],0,'All masks from 0 to 2^n-1 cover the power set.')]),
    p('TRIE','Max XOR With Bit Trie','O(n * 32)','Use when each number needs the best XOR partner among previous/all numbers.','At each bit, prefer the opposite bit path if it exists.','Greedily make the highest XOR bit 1 before caring about lower bits.',['Querying a trie that has no numbers.','Descending the wrong branch after setting XOR bit.'],['Maximum XOR of Two Numbers in an Array'],
`int getMax(int x){
    Node* node = root; int ans = 0;
    for(int b=31;b>=0;b--){
        int bit = (x>>b)&1;
        int want = bit ^ 1;
        if(node->child[want]){
            ans |= (1<<b);
            node = node->child[want];
        }else node = node->child[bit];
    }
    return ans;
}`,
['start at root','read bit','prefer opposite','set answer bit','fallback same bit'],
[tape(['x bit','0','want','1'],[1,3],[],2,'If current bit is 0, prefer trie branch 1.'),
 tape(['1','0','1','1'],[0],[],3,'Taking opposite branch turns this high XOR bit on.'),
 tape(['fallback'],[0],[],4,'If opposite branch is missing, follow the same bit.'),
 tape(['best','xor'],[],[0,1],4,'Greedy high-to-low choice maximizes XOR.')])
  ]},

math:{
  pageTitle:'Math & Geometry - GCD, Sieve, Matrix, Fast Power, Geometry',
  description:'Interactive math and geometry hub with vector diagrams, Striver style C++ and core number theory templates.',
  badge:'MATH', title:'Math & Geometry', eyebrow:'Math Pattern Hub',
  heroTitle:'Make formulas <b>visible</b>.',
  heroSub:'Number theory, matrices and geometry patterns are easier when the invariant is drawn. Step through vector diagrams and <b>Striver-style C++</b> templates.',
  topDesc:'This hub collects the small reusable math routines that unlock many DSA problems: gcd, sieve, fast power, matrix traversal, rotation and geometry orientation.',
  primaryCta:'Explore math patterns', accent:'#7c93ff', rgb:'124,147,255',
  patterns:[
    p('NUMBER','Euclidean GCD','O(log min(a,b))','Use when reducing fractions, checking divisibility, or normalizing ratios.','gcd(a,b) = gcd(b, a%b). Repeatedly replace the bigger problem by its remainder.','Keep paying the debt with the largest possible equal chunks; the final chunk size is the gcd.',['Modulo by zero if loop guard is wrong.','Using subtraction-based gcd when modulo is faster.'],['GCD','LCM','Fraction Addition'],
`int gcd(int a, int b){
    while(b != 0){
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}`,
['while b != 0','r = a % b','a = b','b = r','return a'],
[tape(['48','18'],[0,1],[],1,'48 % 18 = 12. Replace (48,18) with (18,12).'),
 tape(['18','12'],[0,1],[],1,'18 % 12 = 6.'),
 tape(['12','6'],[0,1],[],1,'12 % 6 = 0, so the loop will stop.'),
 tape(['gcd','=','6'],[],[2],4,'The last non-zero divisor is the gcd.')]),
    p('PRIME','Sieve of Eratosthenes','O(n log log n)','Use when many prime checks are needed up to n.','Assume all numbers prime, then mark multiples of each prime starting from p*p.','Once a prime is known, cross out every larger number it generates.',['Starting multiples at 2*p creates repeated work.','Not handling 0 and 1 as non-prime.'],['Count Primes','Prime Factorization'],
`vector<int> sieve(int n){
    vector<int> prime(n+1, 1);
    prime[0] = prime[1] = 0;
    for(long long p=2; p*p<=n; p++){
        if(!prime[p]) continue;
        for(long long x=p*p; x<=n; x+=p)
            prime[x] = 0;
    }
    return prime;
}`,
['mark 0/1 false','p*p <= n','skip composite p','mark multiples from p*p','return table'],
[tape(['2','3','4','5','6','7','8','9'],[0],[],1,'Start p=2.'),
 tape(['2','3','4','5','6','7','8','9'],[2,4,6],[],3,'Mark multiples 4,6,8 as composite.'),
 tape(['2','3','4','5','6','7','8','9'],[7],[],3,'For p=3, start at 9 because smaller multiples were already marked.'),
 tape(['2','3','5','7'],[],[0,1,2,3],4,'Remaining true entries are primes.')]),
    p('POWER','Fast Power','O(log n)','Use for modular exponentiation or large powers.','Binary exponentiation squares the base each step and multiplies answer when the current exponent bit is 1.','Read the exponent in binary; each bit decides whether to take the current power block.',['Forgetting modulo after multiplication.','Overflowing int before modulo; use long long.'],['Pow(x,n)','Modular Exponentiation'],
`long long power(long long a, long long n, long long mod){
    long long ans = 1;
    while(n > 0){
        if(n & 1) ans = (ans * a) % mod;
        a = (a * a) % mod;
        n >>= 1;
    }
    return ans;
}`,
['ans = 1','if low bit set multiply','square base','shift exponent','return ans'],
[tape(['n=13','1101'],[1],[],1,'13 in binary is 1101; the low bit is set.'),
 tape(['ans*=a','a=a^2','n>>=1'],[0,1,2],[],2,'After processing a bit, square the base and shift exponent.'),
 tape(['take','skip','take','take'],[0,2,3],[],1,'Only set bits contribute to the answer.'),
 tape(['O(log n)'],[],[0],4,'The exponent halves every step.')]),
    p('MATRIX','Spiral Matrix','O(m*n)','Use when a matrix must be traversed layer by layer.','Maintain top, bottom, left, right boundaries. Traverse four sides, then shrink boundaries.','Peel the matrix like an onion, one rectangular layer at a time.',['Not checking bounds between side traversals.','Duplicate center row/column on odd dimensions.'],['Spiral Matrix','Spiral Matrix II'],
`vector<int> spiralOrder(vector<vector<int>>& a){
    int top=0, bot=a.size()-1, left=0, right=a[0].size()-1;
    vector<int> ans;
    while(top<=bot && left<=right){
        for(int c=left;c<=right;c++) ans.push_back(a[top][c]);
        top++;
        for(int r=top;r<=bot;r++) ans.push_back(a[r][right]);
        right--;
        if(top<=bot) for(int c=right;c>=left;c--) ans.push_back(a[bot][c]);
        bot--;
        if(left<=right) for(int r=bot;r>=top;r--) ans.push_back(a[r][left]);
        left++;
    }
    return ans;
}`,
['set boundaries','top row','right column','bottom row if valid','left column if valid'],
[mat([[1,2,3],[4,5,6],[7,8,9]],['0,0','0,1','0,2'],[],1,'Traverse the top row left to right.'),
 mat([[1,2,3],[4,5,6],[7,8,9]],['1,2','2,2'],['0,0','0,1','0,2'],2,'Then traverse the right column.'),
 mat([[1,2,3],[4,5,6],[7,8,9]],['2,1','2,0'],['0,0','0,1','0,2','1,2','2,2'],3,'Traverse bottom row if still valid.'),
 mat([[1,2,3],[4,5,6],[7,8,9]],['1,1'],['0,0','0,1','0,2','1,2','2,2','2,1','2,0','1,0'],4,'Shrink boundaries and finish the center.')]),
    p('MATRIX','Rotate Image 90 Degrees','O(n^2)','Use for in-place square matrix rotation.','Transpose the matrix, then reverse every row.','Flip across the diagonal, then mirror horizontally.',['Trying to rotate layer-by-layer with index mistakes when transpose+reverse is simpler.','Using this on non-square matrices.'],['Rotate Image'],
`void rotate(vector<vector<int>>& a){
    int n = a.size();
    for(int i=0;i<n;i++)
        for(int j=i+1;j<n;j++)
            swap(a[i][j], a[j][i]);
    for(int i=0;i<n;i++)
        reverse(a[i].begin(), a[i].end());
}`,
['n = size','transpose upper triangle','swap a[i][j],a[j][i]','reverse each row'],
[mat([[1,2,3],[4,5,6],[7,8,9]],['0,1','1,0'],[],2,'Transpose swaps across the main diagonal.'),
 mat([[1,4,7],[2,5,8],[3,6,9]],['0,0','0,2'],[],3,'Reverse each row after transpose.'),
 mat([[7,4,1],[8,5,2],[9,6,3]],[],['0,0','0,1','0,2','1,0','1,1','1,2','2,0','2,1','2,2'],3,'The matrix is rotated 90 degrees clockwise.'),
 mat([[1,2],[3,4]],['0,1','1,0'],[],2,'The same invariant works for every square size.')]),
    p('GEOMETRY','Orientation / Cross Product','O(1)','Use for line intersection, convex hull, and point turn direction.','Cross product sign of (b-a) x (c-a) tells clockwise, counter-clockwise, or collinear.','Stand at A facing B; C on your left gives positive turn, right gives negative.', ['Swapping vector order changes sign.','Using int when coordinates can overflow.'],['Convex Hull','Line Segment Intersection'],
`long long cross(Point a, Point b, Point c){
    long long x1 = b.x - a.x, y1 = b.y - a.y;
    long long x2 = c.x - a.x, y2 = c.y - a.y;
    return x1*y2 - y1*x2;
}
// >0 counter-clockwise, <0 clockwise, 0 collinear`,
['vector AB','vector AC','compute determinant','sign gives turn'],
[tree([{x:100,y:190,t:'A'},{x:260,y:105,t:'B'},{x:410,y:55,t:'C'}],[[0,1],[0,2]],[0,1,2],[],2,'Compute vectors AB and AC from the same origin A.',[[0,1],[0,2]]),
 tree([{x:100,y:190,t:'A'},{x:260,y:105,t:'B'},{x:420,y:185,t:'C'}],[[0,1],[0,2]],[2],[],3,'If the determinant is negative, C is to the right of AB.'),
 tree([{x:100,y:190,t:'A'},{x:260,y:105,t:'B'},{x:405,y:28,t:'C'}],[[0,1],[0,2]],[2],[],3,'If positive, C is to the left of AB.'),
 tree([{x:100,y:190,t:'A'},{x:260,y:105,t:'B'},{x:420,y:20,t:'C'}],[[0,1],[1,2]],[0,1,2],[],3,'If zero, all three points are collinear.')])
  ]}
};
})();

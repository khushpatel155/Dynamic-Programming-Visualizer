import React, { useState } from 'react';
import Icon from '../AppIcon';

const AlgorithmCodeDisplay = ({ problemType, selectedAlgorithm }) => {
  const [activeTab, setActiveTab] = useState('recursive');

  const fibonacciCode = {
    recursive: `
int fibonacci(int n) {
    
    if (n <= 1) return n;
    
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int n = 5;
    int result = fibonacci(n);
    cout << "F(" << n << ") = " << result << endl;
    return 0;
}`,

    memoization: `
#include <bits/stdc++.h>
using namespace std;

int fibonacciMemo(int n, vector<int>& dp) {
    
    if (n <= 1) return n;
    
    if (dp[n] != -1) return dp[n]; 
    
    dp[n] = fibonacciMemo(n - 1, dp) + fibonacciMemo(n - 2, dp);
    return dp[n];
}

int fibonacci(int n) {
    vector<int> dp(n + 1, -1);
    return fibonacciMemo(n, dp);
}

int main() {
    int n = 5;
    int result = fibonacci(n);
    cout << "F(" << n << ") = " << result << endl;
    return 0;
}`,

    tabulation: `
#include <bits/stdc++.h>
using namespace std;

int fibonacci(int n) {

    if (n <= 1) return n;
    
    vector<int> dp(n + 1);
    
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    
    return dp[n];
}

int main() {
    int n = 5;
    int result = fibonacci(n);
    cout << "F(" << n << ") = " << result << endl;
    return 0;
}`
  };

  const houseRobberCode = {
    recursive: `
#include <bits/stdc++.h>
using namespace std;

int rob(vector<int>& houses, int index) {
    
    if (index == houses.size() - 1) return houses[index];
    
    if(index+2<houses.size()) int robCurrent = houses[index] + rob(houses, index + 2);  
    int skipCurrent = rob(houses, index + 1);                 
    
    return max(robCurrent, skipCurrent);
}

int rob(vector<int>& houses) {
    return rob(houses, 0);
}

int main() {
    vector<int> houses = {2, 7, 9, 3, 1};
    int result = rob(houses);
    cout << "Maximum amount: " << result << endl;
    return 0;
}`,

    memoization: `
#include <bits/stdc++.h>
using namespace std;

int robMemo(vector<int>& houses, int index, vector<int>& dp) {
    
    if (dp[index] != -1) return dp[index]; 
    
    if (index == houses.size() - 1) return dp[index] = houses[index];
    
    int robCurrent = houses[index] + robMemo(houses, index + 2, dp);
    int skipCurrent = robMemo(houses, index + 1, dp);
    
    dp[index] = max(robCurrent, skipCurrent);
    return dp[index];
}

int rob(vector<int>& houses) {
    vector<int> dp(houses.size(), -1);
    return robMemo(houses, 0, dp);
}

int main() {
    vector<int> houses = {2, 7, 9, 3, 1};
    int result = rob(houses);
    cout << "Maximum amount: " << result << endl;
    return 0;
}`,

    tabulation: `
#include <bits/stdc++.h>
using namespace std;

int rob(vector<int>& houses) {

    int n = houses.size();
    if (n == 0) return 0;
    if (n == 1) return houses[0];
    
    vector<int> dp(n);
    
    dp[n - 1] = houses[n - 1];
    
    for (int i = n - 2; i >= 0; i--) {
        int robCurrent = 0;
        if(i+2<n) robCurrent = houses[i] + dp[i + 2];

        int skipCurrent = dp[i + 1];

        dp[i] = max(robCurrent, skipCurrent);
    }
    
    return dp[0];
}

int main() {
    vector<int> houses = {2, 7, 9, 3, 1};
    int result = rob(houses);
    cout << "Maximum amount: " << result << endl;
    return 0;
}`
  };

  const frogJumpCode = {
    recursive: `
#include <bits/stdc++.h>
using namespace std;

int minEnergy(vector<int>& heights, int index, int k) {
    
    if (index == 0) {
        return 0;
    }
    
    int minCost = INT_MAX;

    for(int j=1;j<=k;j++){
        if(index-j>=0){
            int jumpCost = abs(heights[index] - heights[index-j]);
            int totalCost = minEnergy(heights, index-j, k) + jumpCost;
            minCost = min(minCost, totalCost);
        }
    }
    
    return minCost;
}

int frogJump(vector<int>& heights, int k) {
    return minEnergy(heights, heights.size() - 1, k);
}

int main() {
    vector<int> heights = {10, 5, 20, 0, 15};
    int k = 2;
    int result = frogJump(heights, k);
    cout << "Minimum energy: " << result << endl;
    return 0;
}`,

    memoization: `
#include <bits/stdc++.h>
using namespace std;

int minEnergyMemo(vector<int>& heights, int index, int k, vector<int>& dp) {
    
    if (index == 0) return 0;
    
    if (dp[index] != -1) return dp[index];
    
    int minCost = INT_MAX;
    
    for(int j=1;j<=k;j++){
        if(index-j>=0){
            int jumpCost = abs(heights[index] - heights[index-j]);
            int totalCost = minEnergyMemo(heights, index-j, k, dp) + jumpCost;
            minCost = min(minCost, totalCost);
        }
    }
    
    return dp[index] = minCost;
}

int frogJump(vector<int>& heights, int k) {
    vector<int> dp(heights.size(), -1); 
    return minEnergyMemo(heights, heights.size() - 1, k, dp);
}

int main() {
    vector<int> heights = {10, 5, 20, 0, 15};
    int k = 2;
    int result = frogJump(heights, k);
    cout << "Minimum energy: " << result << endl;
    return 0;
}`,

    tabulation: `
#include <bits/stdc++.h>
using namespace std;

int frogJump(vector<int>& heights, int k) {

    int n = heights.size();
    vector<int> dp(n, INT_MAX);
    
    dp[0] = 0;
    
    for (int i = 1; i < n; i++) {
        for (int j = 1; j <= k; j++) {

            if(i-j>=0){
                int jumpCost = abs(heights[i] - heights[i-j]);
                dp[i] = min(dp[i], dp[i-j] + jumpCost);
            }

        }
    }
    
    return dp[n - 1];
}

int main() {
    vector<int> heights = {10, 5, 20, 0, 15};
    int k = 2;
    int result = frogJump(heights, k);
    cout << "Minimum energy: " << result << endl;
    return 0;
}`
  };

  const getCodeForProblem = () => {
    switch (problemType) {
      case 'fibonacci':
        return fibonacciCode;
      case 'house-robber':
        return houseRobberCode;
      case 'frog-jump':
        return frogJumpCode;
      default:
        return fibonacciCode;
    }
  };

  const codeData = getCodeForProblem();
  const algorithms = [
    { id: 'recursive', name: 'Recursive', icon: 'GitBranch' },
    { id: 'memoization', name: 'Memoization', icon: 'Database' },
    { id: 'tabulation', name: 'Tabulation', icon: 'Table' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Code" size={20} className="text-primary" />
          <h3 className="text-heading-sm text-text-primary">C++ Implementation</h3>
        </div>
      </div>

      {/* Algorithm Tabs */}
      <div className="flex border-b border-border">
        {algorithms.map((algorithm) => (
          <button
            key={algorithm.id}
            onClick={() => setActiveTab(algorithm.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-body-sm font-medium border-b-2 transition-educational ${
              activeTab === algorithm.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-dark'
            }`}
          >
            <Icon name={algorithm.icon} size={16} />
            <span>{algorithm.name}</span>
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="p-4">
        <pre className="bg-surface-100 border border-border-light rounded-lg p-4 overflow-x-auto text-body-sm font-mono text-text-primary">
          <code>{codeData[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
};

export default AlgorithmCodeDisplay; 
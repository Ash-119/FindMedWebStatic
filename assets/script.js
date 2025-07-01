let herbList = [];

// 1. 讀 CSV
Papa.parse("herb_data.csv", {
  download: true,
  header: true,
  complete: (results) => {
    herbList = results.data.map(r => ({
      name: r["藥品名稱"],
      loc: r["位置代號"]
    }));
  }
});

// 2. 建 Fuse.js instance
const fuse = new Fuse(herbList, {
  keys: ["name"],
  threshold: 0.4,    // 越小越嚴謹
  includeScore: true,
  ignoreLocation: true
});

// 3. 綁定搜尋按鈕
document.getElementById("searchBtn").onclick = () => {
  const q = document.getElementById("searchBox").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!q) {
    resultsDiv.textContent = "請輸入關鍵字";
    return;
  }

  const matches = fuse.search(q);
  if (matches.length === 0) {
    resultsDiv.textContent = "找不到相關藥品";
    return;
  }

  // 4. 顯示結果
  matches.forEach(m => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.textContent = `${m.item.name}（位置：${m.item.loc}）`;
    resultsDiv.appendChild(div);
  });
};

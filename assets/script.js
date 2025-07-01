let fuse;
let herbList = [];

// 1. 讀 CSV 並在完成後設定 Fuse 與按鈕事件
Papa.parse("herb_data.csv", {
  download: true,
  header: true,
  complete: (res) => {
    // 轉換成簡單物件
    herbList = res.data.map(r => ({
      name: r["藥品名稱"],
      loc:  r["位置代號"]
    }));

    // 2. 建立 Fuse.js instance
    fuse = new Fuse(herbList, {
      keys: ["name"],
      threshold: 0.4,
      ignoreLocation: true
    });

    // 3. 綁定 Form submit，Enter 或按鈕都能觸發搜尋
    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      doSearch();
    });
  },
  error: (err) => {
    console.error("CSV 讀取失敗：", err);
  }
});

// 搜尋主程式
function doSearch() {
  const q = document.getElementById("searchBox").value.trim();
  const out = document.getElementById("results");
  out.innerHTML = "";

  if (!q) {
    out.textContent = "請先輸入關鍵字";
    return;
  }

  const matches = fuse.search(q);
  if (matches.length === 0) {
    out.textContent = "找不到相關藥品";
    return;
  }

  matches.forEach(m => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.textContent = `${m.item.name}（位置：${m.item.loc}）`;
    out.appendChild(div);
  });
}

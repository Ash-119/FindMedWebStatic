let fuse;  // 不馬上建立
let herbList = [];

// 1. 讀 CSV 並在完成後設定 Fuse 與按鈕事件
Papa.parse("herb_data.csv", {
  download: true,
  header: true,
  complete: (res) => {
    // 把原本的物件鍵改為英文比較好用
    herbList = res.data.map(r => ({
      name: r["藥品名稱"],
      loc:  r["位置代號"]
    }));

    // 2. 在這裡建立 Fuse
    fuse = new Fuse(herbList, {
      keys: ["name"],
      threshold: 0.4,
      ignoreLocation: true
    });

    // 3. 綁定按鈕事件（此時 fuse & herbList 都已就緒）
    document.getElementById("searchBtn").onclick = () => {
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
    };
  },
  error: (err) => {
    console.error("CSV 讀取失敗：", err);
  }
});

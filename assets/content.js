/* Render Pages CMS JSON without changing the classic page design. */
(() => {
  "use strict";

  const allowed = new Set(["music", "webapps", "games", "news", "profile", "works", "works-latest"]);

  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text != null) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };

  const validUrl = value => {
    try {
      const url = new URL(value, window.location.href);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };

  const link = (url, label) => {
    const href = validUrl(url);
    if (!href) return null;
    const a = node("a", label);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  };

  const appendDescription = (container, description) => {
    if (description) container.append(node("p", description));
  };

  const addMedia = (container, image, title) => {
    const src = validUrl(image);
    if (!src) return;
    const img = node("img", null, "work-image");
    img.src = src;
    img.alt = title || "";
    img.loading = "lazy";
    container.append(img);
  };

  const renderItem = (item, type) => {
    const section = node("section", null, "work-entry");
    section.append(node("h3", item.title || "無題"));
    if (type === "music") {
      if (item.track_id && /^[0-9]+$/.test(String(item.track_id))) {
        const frame = node("iframe");
        frame.src = "https://w.soundcloud.com/player/?url=" +
          encodeURIComponent("https://api.soundcloud.com/tracks/" + item.track_id) +
          "&auto_play=false";
        frame.title = (item.title || "楽曲") + " - SoundCloud";
        frame.width = "100%";
        frame.height = "166";
        frame.setAttribute("loading", "lazy");
        frame.setAttribute("allow", "autoplay");
        section.append(frame);
      }
      const a = link(item.url, "SoundCloudで開く");
      if (a) {
        const p = node("p");
        p.append(a);
        section.append(p);
      }
    } else {
      addMedia(section, item.image, item.title);
      const external = link(item.url, type === "games" ? "ゲームをプレイ" : "作品を見る");
      if (external) {
        const p = node("p");
        p.append(external);
        section.append(p);
      }
      const source = link(item.source, "ソースコード");
      if (source) {
        const p = node("p");
        p.append(source);
        section.append(p);
      }
    }
    appendDescription(section, item.description);
    return section;
  };

  function render(root, category, data) {
    root.replaceChildren();
    if (category === "profile") {
      const entries = [
        ["name", ""], ["birth_year", "年生まれ"], ["origin", "出身"]
      ];
      for (const [key, suffix] of entries) {
        if (data[key]) root.append(node("p", data[key] + suffix));
      }
      const links = Array.isArray(data.links) ? data.links : [];
      for (const item of links) {
        const a = link(item.url, item.label || item.url);
        if (a) {
          const p = node("p");
          p.append(a);
          root.append(p);
        }
      }
      return;
    }
    if (!Array.isArray(data)) throw new Error("Invalid content format");
    if (category === "works" || category === "works-latest") {
      const items = data.filter(item => item && item.published !== false);
      items.sort((a, b) => {
        const da = /^\d{4}-\d{2}-\d{2}$/.test(a.date || "") ? a.date : "";
        const db = /^\d{4}-\d{2}-\d{2}$/.test(b.date || "") ? b.date : "";
        return db.localeCompare(da);
      });
      if (!items.length) {
        root.append(node("p", "現在、公開中の制作物はありません。"));
        return;
      }
      const categories = {music: "音楽", game: "ゲーム", article: "記事", other: "その他"};
      const table = node("table", null, "classic");
      const thead = node("thead");
      const headRow = node("tr");
      for (const label of ["公開日", "ジャンル", "制作物"]) headRow.append(node("th", label));
      thead.append(headRow);
      table.append(thead);
      const tbody = node("tbody");
      for (const item of category === "works-latest" ? items.slice(0, 5) : items) {
        const row = node("tr");
        row.append(node("td", item.date || "—"));
        row.append(node("td", categories[item.category] || "その他"));
        const cell = node("td");
        const a = link(item.url, item.title || "無題");
        if (a) cell.append(a);
        else cell.append(node("span", item.title || "無題"));
        if (item.description) {
          cell.append(node("div", item.description, "small"));
        }
        row.append(cell);
        tbody.append(row);
      }
      table.append(tbody);
      root.append(table);
      return;
    }
    const entries = data.filter(item => item && item.published !== false);
    if (category === "news") entries.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!entries.length) {
      root.append(node("p", "現在、公開中の作品はありません。"));
      return;
    }
    for (const item of entries) {
      if (category === "news") {
        const p = node("p");
        p.append(node("span", [item.date, item.title].filter(Boolean).join("　")));
        if (item.body) {
          const body = node("span");
          body.style.whiteSpace = "pre-line";
          body.append(document.createTextNode("\n" + item.body));
          p.append(body);
        }
        root.append(p);
      } else {
        root.append(renderItem(item, category));
      }
    }
  }

  for (const root of document.querySelectorAll("[data-content]")) {
    const category = root.dataset.content;
    if (!allowed.has(category)) continue;
    const fileCategory = category === "works-latest" ? "works" : category;
    fetch("data/" + fileCategory + ".json", { cache: "no-cache" })
      .then(response => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(data => render(root, category, data))
      .catch(error => {
        console.error("Content could not be loaded:", error);
        root.replaceChildren(node("p", "コンテンツを読み込めませんでした。"));
      });
  }
})();

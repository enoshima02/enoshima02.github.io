/* Render Pages CMS JSON without changing the classic page design. */
(() => {
  "use strict";

  const root = document.querySelector("[data-content]");
  if (!root) return;

  const category = root.dataset.content;
  const allowed = new Set(["music", "photos", "webapps", "games", "news", "profile"]);
  if (!allowed.has(category)) return;

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

  function render(data) {
    root.replaceChildren();
    if (category === "profile") {
      const entries = [
        ["name", ""], ["birth_year", "年生まれ"], ["origin", "出身"]
      ];
      for (const [key, suffix] of entries) {
        if (data[key]) root.append(node("p", data[key] + suffix));
      }
      for (const [key, label] of [["x", "X"], ["github", "GitHub"], ["soundcloud", "SoundCloud"]]) {
        const a = link(data[key], label);
        if (a) {
          const p = node("p");
          p.append(a);
          root.append(p);
        }
      }
      return;
    }
    if (!Array.isArray(data)) throw new Error("Invalid content format");
    const entries = data.filter(item => item && item.published !== false);
    if (category === "news") entries.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!entries.length) {
      root.append(node("p", "現在、公開中の作品はありません。"));
      return;
    }
    for (const item of entries) {
      if (category === "news") {
        const p = node("p", [item.date, item.title].filter(Boolean).join("　"));
        const a = link(item.url, "詳細");
        if (a) { p.append(" "); p.append(a); }
        root.append(p);
      } else {
        root.append(renderItem(item, category));
      }
    }
  }

  fetch("data/" + category + ".json", { cache: "no-cache" })
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(render)
    .catch(error => {
      console.error("Content could not be loaded:", error);
      root.replaceChildren(node("p", "コンテンツを読み込めませんでした。"));
    });
})();

const menu = document.querySelector("ul#menu");
const menuBtn = document.querySelector(".actions button:last-child");
menuBtn.addEventListener("click", function () {
  menu.classList.toggle("open");
});
menu.addEventListener("click", function () {
  menu.classList.remove("open");
});
const phrases = ["người đam mê khám phá ngôn ngữ", "thám tử săn lỗi code", "người tỉ mỉ trong từng chi tiết"];
const typing = document.getElementById("typing");
let p = 0, c = 0, xoa = false;
function type() {
  const text = phrases[p];
  c += xoa ? -1 : 1;
  typing.textContent = text.slice(0, c);
  let wait = xoa ? 40 : 90;
  if (!xoa && c === text.length) { xoa = true; wait = 1200; }
  else if (xoa && c === 0) { xoa = false; p = (p + 1) % phrases.length; wait = 300; }
  setTimeout(type, wait);
}
const typingLine = typing.parentElement; 
function giuChieuCao() {
  typingLine.style.minHeight = "";
  let cao = 0;
  phrases.forEach(function (cau) {
    typing.textContent = cau;
    cao = Math.max(cao, typingLine.offsetHeight);
  });
  typingLine.style.minHeight = cao + "px";
  typing.textContent = phrases[p].slice(0, c);
}
giuChieuCao();
document.fonts.ready.then(giuChieuCao); 
window.addEventListener("resize", giuChieuCao); 
type();
const filters = document.querySelectorAll(".filter");
filters.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const loai = btn.dataset.filter;
    if (loai === "all") { nhayDen(0); return; } 
    const idx = dsCards.findIndex(function (c) { return c.dataset.type === loai; });
    if (idx >= 0) nhayDen(idx + 1);
  });
});
const bieuTuong = { "HTML": "🌐", "CSS": "🎨", "JavaScript": "⚡", "Java": "☕", "Git / GitHub": "🔀", "Python": "🐍" };
const dsSkill = Array.from(document.querySelectorAll(".skill"));
const maxLevel = Math.max.apply(null, dsSkill.map(function (s) { return +s.dataset.level; }));
let daGhim = false;
dsSkill.forEach(function (s) {
  const level = +s.dataset.level;
  const ten = s.querySelector(".skill-top span").textContent.trim();
  const full = Math.round(level / 5);                       
  const bac = "Đang luyện";
  s.dataset.rank = "thap";
  if (level === maxLevel && !daGhim) { s.classList.add("top"); daGhim = true; }
  s.querySelector(".skill-top").innerHTML =
    '<span class="sk-icon">' + (bieuTuong[ten] || "🔍") + '</span>' +
    '<span class="sk-name">' + ten + '</span>' +
    '<span class="sk-rank">' + bac + '</span>';
  let seg = "";
  for (let i = 0; i < 20; i++) {
    seg += '<i style="--d:' + (i * 45) + 'ms"' + (i < full ? ' class="on"' : "") + "></i>";
  }
  s.querySelector(".bar").innerHTML = seg;
  s.insertAdjacentHTML("beforeend", '<p class="sk-pct"><b data-to="' + level + '">0</b>%</p>');
});
const skillSec = document.getElementById("ky-nang");
new IntersectionObserver(function (es, ob) {
  if (!es[0].isIntersecting) return;
  ob.disconnect();
  skillSec.querySelectorAll(".sk-pct b").forEach(function (b) {
    const to = +b.dataset.to, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1200, 1);
      b.textContent = Math.round(to * p);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.3 }).observe(skillSec);
const links = document.querySelectorAll(".thanhdieuhuong ul a");
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-30% 0px -50% 0px" });
document.querySelectorAll("section").forEach(function (s) { observer.observe(s); });
const topBtn = document.getElementById("top-button");
window.addEventListener("scroll", function () {
  topBtn.classList.toggle("show", window.scrollY > 300);
});
topBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
const modal = document.getElementById("modal");
const modalEyebrow = document.getElementById("modal-eyebrow");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
let nutMo = null; 
function moModal(card) {
  const detail = card.querySelector(".detail");
  const tieuDe = card.querySelector(".body h3").textContent;
  nutMo = card.querySelector(".link-detail");
  modalEyebrow.textContent = detail.dataset.eyebrow;
  modalTitle.textContent = tieuDe;
  modalBody.innerHTML = detail.innerHTML;
  modalBody.scrollTop = 0;
  modal.classList.add("open");
  document.body.classList.add("no-scroll");
  modal.querySelector(".modal-close").focus();
}
function dongModal() {
  modal.classList.remove("open");
  document.body.classList.remove("no-scroll");
  if (nutMo) nutMo.focus();
}
const gridDuAn = document.querySelector("#du-an .grid");
const book = document.createElement("div");
book.className = "book";
gridDuAn.classList.add("is-book"); 
gridDuAn.after(book);
let leaves = [], dsCards = [], cur = 0, prevBtn, nextBtn, info;
function capNhatSach() {
  leaves.forEach(function (l, i) { l.classList.toggle("flipped", i < cur); });
  prevBtn.disabled = cur === 0;
  nextBtn.disabled = cur >= leaves.length - 1;
  info.textContent = cur === 0 ? "Bìa hồ sơ" : "Trang " + cur + " / " + (leaves.length - 1);
  const loai = cur === 0 ? "all" : dsCards[cur - 1].dataset.type;
  filters.forEach(function (f) { f.classList.toggle("active", f.dataset.filter === loai); });
}
function nhayDen(moi) {
  if (moi === cur || moi < 0 || moi > leaves.length - 1) return;
  const ds = [];
  for (let i = Math.min(cur, moi); i < Math.max(cur, moi); i++) ds.push(i);
  if (moi < cur) ds.reverse(); 
  ds.forEach(function (i, k) { leaves[i].style.transitionDelay = (k * 0.15) + "s"; });
  cur = moi;
  capNhatSach();
  setTimeout(function () {
    leaves.forEach(function (l) { l.style.transitionDelay = ""; });
  }, 1600);
}
function lat(huong) { nhayDen(cur + huong); }
function themLeaf(stage, face) {
  const idx = leaves.length;
  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.style.zIndex = 100 - idx; 
  leaf.appendChild(face);
  leaf.addEventListener("click", function (e) {
    if (e.target.closest("button, a")) return;
    if (idx === cur) lat(1); 
  });
  stage.appendChild(leaf);
  leaves.push(leaf);
}
function xayDungSach() {
  book.innerHTML = "";
  leaves = [];
  cur = 0;
  const cards = Array.from(document.querySelectorAll(".proj"));
  dsCards=cards;
  const stage = document.createElement("div");
  stage.className = "book-stage";
  const bia = document.createElement("div");
  bia.className = "leaf-face cover-face";
  bia.innerHTML =
    '<span class="bk-tab">HỒ SƠ</span>' +
    '<div class="bk-stamp">TUYỆT MẬT</div>' +
    '<div class="bk-label"><p class="bk-title">Hồ sơ dự án</p><p class="bk-no"></p></div>' +
    '<p class="bk-hint">Chạm để lật trang</p>';
  bia.querySelector(".bk-no").textContent = cards.length + " hồ sơ bên trong";
  themLeaf(stage, bia);
  cards.forEach(function (card, i) {
    const face = document.createElement("div");
    face.className = "leaf-face page-face";
    const eb = document.createElement("p");
    eb.className = "page-eyebrow";
    eb.textContent = card.querySelector(".detail").dataset.eyebrow;
    face.appendChild(eb);
    const img = card.querySelector(":scope > img");
    if (img) face.appendChild(img.cloneNode(true));
    const body = card.querySelector(".body").cloneNode(true);
    face.appendChild(body);
    const no = document.createElement("p");
    no.className = "page-no";
    no.textContent = "Trang " + (i + 1) + " / " + cards.length;
    face.appendChild(no);
    body.querySelector(".link-detail").addEventListener("click", function (e) {
      e.stopPropagation();
      moModal(card);
      nutMo = e.currentTarget;
    });
    themLeaf(stage, face);
  });
  const nav = document.createElement("div");
  nav.className = "book-nav";
  prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "book-btn";
  prevBtn.textContent = "← Trang trước";
  nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "book-btn";
  nextBtn.textContent = "Trang sau →";
  info = document.createElement("span");
  info.className = "book-info";
  prevBtn.addEventListener("click", function () { lat(-1); });
  nextBtn.addEventListener("click", function () { lat(1); });
  nav.append(prevBtn, info, nextBtn);
  book.append(stage, nav);
  capNhatSach();
}
xayDungSach();
document.querySelectorAll("[data-close]").forEach(function (b) {
  b.addEventListener("click", dongModal);
});
modal.addEventListener("click", function (e) {
  if (e.target === modal) dongModal(); 
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && modal.classList.contains("open")) dongModal();
});
const form = document.getElementById("contact");
function baoLoi(id, msg) {
  document.getElementById("err-" + id).textContent = msg;
  return msg === "";
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const ok1 = baoLoi("name", name.length < 2 ? "Họ tên cần ít nhất 2 ký tự." : "");
  const ok2 = baoLoi("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email chưa đúng định dạng.");
  const ok3 = baoLoi("message", message.length < 10 ? "Lời nhắn cần ít nhất 10 ký tự." : "");
  const thanhCong = ok1 && ok2 && ok3;
  document.getElementById("form-oke").textContent = thanhCong ? "Cảm ơn bạn, mình đã nhận được lời nhắn!" : "";
  if (thanhCong) form.reset();
});
const xp = document.createElement("div");
xp.id = "xp-bar";
document.body.appendChild(xp);
window.addEventListener("scroll", function () {
  const het = document.documentElement.scrollHeight - window.innerHeight;
  xp.style.width = (window.scrollY / het) * 100 + "%";
});
const anhChungChi = [
  { side: "left",  top: 140, x: 0,  rot: -3, pin: false, src: "images/h9.jpg", cap: "Sở thích" },
  { side: "left",  top: 360, x: 30, rot: 3,  pin: true,  src: "images/h7.jpg", cap: "Manh mối" },
  { side: "right", top: 240, x: 30, rot: 3,  pin: true,  src: "images/h8.jpg", cap: "Dấu vết" },
  { side: "right", top: 480, x: 30, rot: -3, pin: false, src: "images/h10.jpg", cap: "Vật chứng 03" }
];
function themAnhChungChi() {
  const sec = document.getElementById("chung-chi");
  anhChungChi.forEach(function (d, i) {
    const f = document.createElement("figure");
    f.className = "side-photo " + d.side + (d.pin ? " pin" : "");
    f.style.top = d.top + "px";
    f.style.setProperty("--rot", d.rot + "deg");
    f.style.setProperty("--x", d.x + "px");
    f.style.transitionDelay = (0.2 + i * 0.15) + "s";
    f.innerHTML = '<img src="' + d.src + '" alt="" loading="lazy"><figcaption>' + d.cap + "</figcaption>";
    f.querySelector("img").addEventListener("error", function () { f.remove(); });
    sec.appendChild(f);
  });
}
themAnhChungChi();
const anhDuAn = [
  { side: "left",  top: 110, x: 0,   rot: 4,  pin: false, src: "images/h1.jpg",  cap: "Vật chứng 02" },
  { side: "right", top: 160, x: 0,   rot: -3, pin: true,  src: "images/h2.jpg",  cap: "Hồ sơ mật" },
  { side: "left",  top: 370, x: 40,  rot: -3, pin: true,  src: "images/h3.jpg",  cap: "Manh mối" },
  { side: "right", top: 400, x: 40,  rot: 3,  pin: false, src: "images/h4.jpg",  cap: "Dấu vết" },
  { side: "left",  top: 640, x: -10, rot: 3,  pin: false, src: "images/h5.jpg", cap: "Nhân chứng" },
  { side: "right", top: 660, x: 0,   rot: -4, pin: true,  src: "images/h6.jpg", cap: "Lưu trữ" }
];
function themAnhDuAn() {
  const sec = document.getElementById("du-an");
  anhDuAn.forEach(function (d, i) {
    const f = document.createElement("figure");
    f.className = "side-photo " + d.side + (d.pin ? " pin" : "");
    f.style.top = d.top + "px";
    f.style.setProperty("--rot", d.rot + "deg");
    f.style.setProperty("--x", d.x + "px");
    f.style.transitionDelay = (0.2 + i * 0.12) + "s";
    f.innerHTML = '<img src="' + d.src + '" alt="" loading="lazy"><figcaption>' + d.cap + "</figcaption>";
    f.querySelector("img").addEventListener("error", function () { f.remove(); });
    sec.appendChild(f);
  });
}
themAnhDuAn();
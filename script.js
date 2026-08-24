const WHATSAPP_NUMBER = "2349061555376";
const DEFAULT_MESSAGE = "I saw your website, how can i book a hair session";

function whatsappUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".whatsapp-link").forEach(link => {
  link.href = whatsappUrl();
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

// Mobile navigation
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Hair design filters
const filters = document.querySelectorAll(".filter");
const styleCards = document.querySelectorAll(".style-card");

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    const value = filter.dataset.filter;

    styleCards.forEach(card => {
      const categories = card.dataset.category.split(" ");
      const show = value === "all" || categories.includes(value);
      card.style.display = show ? "" : "none";
    });
  });
});

// Hair image lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".style-card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  });
});
lightboxClose.addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.remove("open");
});

// Our Queens gallery — demo persistence with localStorage
const queenGrid = document.getElementById("queenGrid");
const emptyQueens = document.getElementById("emptyQueens");
const adminModal = document.getElementById("adminModal");
const openAdmin = document.getElementById("openAdmin");
const emptyAdd = document.getElementById("emptyAdd");
const closeAdmin = document.getElementById("closeAdmin");
const queenForm = document.getElementById("queenForm");

let queens = JSON.parse(localStorage.getItem("favLuxeQueens") || "[]");

function saveQueens() {
  localStorage.setItem("favLuxeQueens", JSON.stringify(queens));
}

function renderQueens() {
  queenGrid.innerHTML = "";

  if (!queens.length) {
    emptyQueens.style.display = "block";
    return;
  }

  emptyQueens.style.display = "none";

  queens.forEach((queen, index) => {
    const card = document.createElement("article");
    card.className = "queen-card";
    card.innerHTML = `
      <button class="delete-queen" data-index="${index}" title="Delete">×</button>
      <img src="${queen.photo}" alt="${escapeHtml(queen.name)}" loading="lazy">
      <div class="queen-meta">
        <h3>${escapeHtml(queen.name)}</h3>
        <p>${escapeHtml(queen.style || "FAV LUXE Style")}</p>
      </div>
    `;
    queenGrid.appendChild(card);
  });

  document.querySelectorAll(".delete-queen").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      if (confirm("Remove this photo from Our Queens?")) {
        queens.splice(index, 1);
        saveQueens();
        renderQueens();
      }
    });
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function showAdmin() {
  adminModal.classList.add("open");
  adminModal.setAttribute("aria-hidden", "false");
}
function hideAdmin() {
  adminModal.classList.remove("open");
  adminModal.setAttribute("aria-hidden", "true");
}

openAdmin.addEventListener("click", showAdmin);
emptyAdd.addEventListener("click", showAdmin);
closeAdmin.addEventListener("click", hideAdmin);
adminModal.addEventListener("click", e => {
  if (e.target === adminModal) hideAdmin();
});

queenForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("queenName").value.trim();
  const style = document.getElementById("queenStyle").value.trim();
  const file = document.getElementById("queenPhoto").files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    queens.unshift({
      name,
      style,
      photo: event.target.result,
      createdAt: new Date().toISOString()
    });
    saveQueens();
    renderQueens();
    queenForm.reset();
    hideAdmin();
  };
  reader.readAsDataURL(file);
});

renderQueens();

// Booking form -> WhatsApp
document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);

  const message =
`Hello FAV LUXE, I would like to book a session.

Name: ${data.get("name")}
Phone: ${data.get("phone")}
Service: ${data.get("service")}
Preferred Date: ${data.get("date") || "Not specified"}
Message: ${data.get("message") || "No additional message"}

I saw your website, how can i book a hair session`;

  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

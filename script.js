/* =========================================================
   ELEMENT REFERENCES
========================================================= */

// Search buttons (class-based)
const desktopSearchBtn = document.querySelector(".desktop-search-btn")
const mobileSearchBtn = document.querySelector(".mobile-search-btn")

const searchOverlay = document.getElementById("search-overlay")
const closeSearch = document.getElementById("close-search")
const searchField = document.getElementById("search-field")

// User menu
const userBtn = document.getElementById("user-btn")
const userDropdown = document.querySelector(".user-dropdown")

// Password toggle
const passwordInput = document.getElementById("password")
const togglePassword = document.getElementById("toggle-password")

// Mobile menu
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navRight = document.querySelector(".nav-right")

/* =========================================================
   SEARCH OVERLAY — SHARED
========================================================= */

function openSearchOverlay() {
  if (!searchOverlay) return
  searchOverlay.classList.add("show")
  searchField?.focus()
}

// Ensure buttons trigger overlay
desktopSearchBtn?.addEventListener("click", openSearchOverlay)
mobileSearchBtn?.addEventListener("click", openSearchOverlay)

// Close button
closeSearch?.addEventListener("click", () => {
  searchOverlay.classList.remove("show")
})

/* =========================================================
   USER MENU DROPDOWN
========================================================= */

if (userBtn && userDropdown) {
  userBtn.addEventListener("click", () => {
    const expanded = userBtn.getAttribute("aria-expanded") === "true"
    const newState = !expanded

    userBtn.setAttribute("aria-expanded", String(newState))
    userDropdown.classList.toggle("show", newState)

    if (newState) {
      const firstFocusable = userDropdown.querySelector("button, a")
      firstFocusable?.focus()
    }
  })

  document.addEventListener("click", (e) => {
    const outside =
      !userBtn.contains(e.target) && !userDropdown.contains(e.target)

    if (outside) {
      userBtn.setAttribute("aria-expanded", "false")
      userDropdown.classList.remove("show")
    }
  })
}

/* =========================================================
   ESC KEY HANDLING
========================================================= */

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return

  searchOverlay?.classList.remove("show")

  if (userDropdown) {
    userBtn?.setAttribute("aria-expanded", "false")
    userDropdown.classList.remove("show")
  }

  if (navRight?.classList.contains("open")) {
    navRight.classList.remove("open")
    mobileMenuBtn?.setAttribute("aria-expanded", "false")
  }
})

/* =========================================================
   PASSWORD TOGGLE
========================================================= */

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password"
    passwordInput.type = isHidden ? "text" : "password"

    togglePassword.innerHTML = isHidden
      ? '<i class="fa-solid fa-eye-slash"></i>'
      : '<i class="fa-solid fa-eye"></i>'

    togglePassword.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    )
    togglePassword.setAttribute("aria-pressed", String(isHidden))
  })
}

/* =========================================================
   MOBILE MENU TOGGLE
========================================================= */

if (mobileMenuBtn && navRight) {
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = navRight.classList.toggle("open")
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen))

    // Toggle hamburger ↔ X icon
    const icon = mobileMenuBtn.querySelector("i")
    if (icon) {
      if (isOpen) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-xmark")
      } else {
        icon.classList.remove("fa-xmark")
        icon.classList.add("fa-bars")
      }
    }

    if (isOpen) {
      const firstNavLink = navRight.querySelector(".nav-links a")
      firstNavLink?.focus()
    }
  })

  document.addEventListener("click", (e) => {
    const inside =
      navRight.contains(e.target) || mobileMenuBtn.contains(e.target)

    if (!inside && navRight.classList.contains("open")) {
      navRight.classList.remove("open")
      mobileMenuBtn.setAttribute("aria-expanded", "false")

      // Reset icon when closing from outside click
      const icon = mobileMenuBtn.querySelector("i")
      if (icon) {
        icon.classList.remove("fa-xmark")
        icon.classList.add("fa-bars")
      }
    }
  })
}

/* =========================================================
   SAFETY FIX: Prevent SVG wrappers from blocking clicks
========================================================= */

document
  .querySelectorAll(".search-icon-wrap, .search-icon")
  .forEach((el) => (el.style.pointerEvents = "none"))

/* =========================================================
   ELEMENT REFERENCES
========================================================= */

// Search
const desktopSearchBtn = document.querySelector(".desktop-search-btn")
const mobileSearchBtn = document.querySelector(".mobile-search-btn")
const searchOverlay = document.getElementById("search-overlay")
const closeSearch = document.getElementById("close-search")
const searchField = document.getElementById("search-field")

// User menu
const userBtn = document.getElementById("user-btn")
const userDropdown = document.querySelector(".user-dropdown")

// Mobile menu
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navRight = document.querySelector(".nav-right")

// Password toggle
const passwordInput = document.getElementById("password")
const togglePassword = document.getElementById("toggle-password")

// Track last focused element for modal return
let lastFocusedElement = null

/* =========================================================
   ACCESSIBLE SEARCH OVERLAY (Dialog)
========================================================= */

function openSearchOverlay() {
  if (!searchOverlay) return

  lastFocusedElement = document.activeElement

  searchOverlay.classList.add("show")
  searchOverlay.setAttribute("aria-hidden", "false")

  // Move focus into modal
  searchField?.focus()

  // Enable traps
  document.addEventListener("keydown", trapSearchFocus)
  document.addEventListener("keydown", escCloseSearch)
}

function closeSearchOverlay() {
  searchOverlay.classList.remove("show")
  searchOverlay.setAttribute("aria-hidden", "true")

  document.removeEventListener("keydown", trapSearchFocus)
  document.removeEventListener("keydown", escCloseSearch)

  // Restore focus
  if (lastFocusedElement) lastFocusedElement.focus()
}

// Open triggers
desktopSearchBtn?.addEventListener("click", openSearchOverlay)
mobileSearchBtn?.addEventListener("click", openSearchOverlay)

// Close trigger
closeSearch?.addEventListener("click", closeSearchOverlay)

// ESC support
function escCloseSearch(e) {
  if (e.key === "Escape") closeSearchOverlay()
}

// Focus trap inside modal
function trapSearchFocus(e) {
  if (!searchOverlay.classList.contains("show")) return
  if (e.key !== "Tab") return

  const focusable = searchOverlay.querySelectorAll(
    'button, input, a[href], [tabindex]:not([tabindex="-1"])'
  )

  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/* =========================================================
   ACCESSIBLE USER DROPDOWN
========================================================= */

if (userBtn && userDropdown) {
  userBtn.addEventListener("click", () => {
    const expanded = userBtn.getAttribute("aria-expanded") === "true"
    const newState = !expanded

    userBtn.setAttribute("aria-expanded", String(newState))
    userDropdown.classList.toggle("show", newState)

    // Focus first item if opening
    if (newState) {
      const firstItem = userDropdown.querySelector("button, a")
      firstItem?.focus()
    }
  })

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userBtn.setAttribute("aria-expanded", "false")
      userDropdown.classList.remove("show")
    }
  })

  // Escape closes dropdown
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      userBtn.setAttribute("aria-expanded", "false")
      userDropdown.classList.remove("show")
      userBtn.focus()
    }
  })
}

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
   ACCESSIBLE MOBILE MENU
========================================================= */

if (mobileMenuBtn && navRight) {
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = navRight.classList.toggle("open")
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen))

    // Toggle icon
    const icon = mobileMenuBtn.querySelector("i")
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen)
      icon.classList.toggle("fa-xmark", isOpen)
    }

    if (isOpen) {
      const firstLink = navRight.querySelector(".nav-links a")
      firstLink?.focus()
    }
  })

  // Close on outside click
  document.addEventListener("click", (e) => {
    const inside =
      mobileMenuBtn.contains(e.target) || navRight.contains(e.target)

    if (!inside && navRight.classList.contains("open")) {
      navRight.classList.remove("open")
      mobileMenuBtn.setAttribute("aria-expanded", "false")

      const icon = mobileMenuBtn.querySelector("i")
      if (icon) {
        icon.classList.remove("fa-xmark")
        icon.classList.add("fa-bars")
      }
    }
  })

  // Escape closes mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navRight.classList.contains("open")) {
      navRight.classList.remove("open")
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      mobileMenuBtn.focus()
    }
  })
}

/* =========================================================
   CLICK-SAFE: Prevent search icons from intercepting clicks
========================================================= */

document
  .querySelectorAll(".search-icon-wrap, .search-icon")
  .forEach((el) => (el.style.pointerEvents = "none"))

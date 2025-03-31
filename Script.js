




function loadPage(page) {
  fetch(page)
      .then(response => response.text())
      .then(data => {
       //   document.getElementById("main-content").innerHTML = data;
          document.getElementById("content-frame").src = page;
      })
      .catch(error => console.error("Error loading page:", error));
}




















// import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sidebar toggle
  document.getElementById("sidebarCollapseBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active")
    document.getElementById("content").classList.toggle("active")
  })

  // Mobile sidebar toggle
  document.getElementById("sidebarCollapse").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active")
    document.getElementById("content").classList.toggle("active")
  })

  // Initialize charts
  initCharts()

  // Load dashboard content by default
  loadContent("dashboard")

  // Initialize action buttons
  initActionButtons()

  // Initialize create buttons
  initCreateButtons()
})

// Function to load content based on navigation
function loadContent(contentType) {
  // Hide all content sections first
  if (contentType !== "dashboard") {
    document.getElementById("dashboard-content").style.display = "none"

    // Create or show the specific content section
    let contentSection = document.getElementById(contentType + "-content")

    if (!contentSection) {
      contentSection = createContentSection(contentType)
      document.getElementById("main-content").appendChild(contentSection)
    } else {
      contentSection.style.display = "block"
    }
  } else {
    document.getElementById("dashboard-content").style.display = "block"

    // Hide all other content sections
    const contentSections = document.querySelectorAll("#main-content > div:not(#dashboard-content)")
    contentSections.forEach((section) => {
      section.style.display = "none"
    })
  }

  // Update active state in sidebar
  updateSidebarActiveState(contentType)

  // Close sidebar on mobile after navigation
  if (window.innerWidth < 768) {
    document.getElementById("sidebar").classList.add("active")
    document.getElementById("content").classList.add("active")
  }
}

// Function to update active state in sidebar
function updateSidebarActiveState(contentType) {
  // Remove active class from all sidebar items
  document.querySelectorAll("#sidebar ul li").forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to the clicked item
  const activeLink = document.querySelector(`#sidebar a[onclick="loadContent('${contentType}')"]`)
  if (activeLink) {
    activeLink.closest("li").classList.add("active")

    // If it's in a submenu, expand the parent menu
    const parentSubmenu = activeLink.closest("ul.collapse")
    if (parentSubmenu) {
      parentSubmenu.classList.add("show")
      const parentToggle = document.querySelector(`a[href="#${parentSubmenu.id}"]`)
      if (parentToggle) {
        parentToggle.setAttribute("aria-expanded", "true")
        parentToggle.classList.remove("collapsed")
      }
    }
  }
}















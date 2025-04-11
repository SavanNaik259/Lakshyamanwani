document.addEventListener("DOMContentLoaded", function() {
  // Direct DOM manipulation approach
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const menuOverlay = document.querySelector('.menu-overlay');
  const body = document.body;
  
  // Close any legacy dropdowns from old CSS
  const legacyDropdowns = document.querySelectorAll('.dropdown-menu:not(#pre-weddings-dropdown-menu)');
  legacyDropdowns.forEach(dropdown => {
    dropdown.style.display = 'none';
  });
  
  // Mobile navigation toggle (hamburger click)
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle mobile navigation
      if (mobileNav.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }
  
  // Helper functions for mobile menu
  function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileNav.style.right = '0px';
    body.classList.add('menu-open');
    if (menuOverlay) {
      menuOverlay.style.opacity = '1';
      menuOverlay.style.pointerEvents = 'auto';
    }
    console.log('Mobile menu opened');
  }
  
  function closeMobileMenu() {
    body.classList.remove('menu-open');
    if (menuOverlay) {
      menuOverlay.style.opacity = '0';
      menuOverlay.style.pointerEvents = 'none';
      menuOverlay.style.visibility = 'hidden';
    }
    
    // First set right position with animation
    mobileNav.style.right = '-320px';
    
    // After transition completes, remove open class
    setTimeout(() => {
      mobileNav.classList.remove('open');
      
      // Close any open mobile dropdowns
      document.querySelectorAll('.mobile-submenu.show').forEach(dropdown => {
        dropdown.classList.remove('show');
      });
      document.querySelectorAll('.mobile-dropdown-btn.active').forEach(btn => {
        btn.classList.remove('active');
      });
    }, 800); // Match CSS transition time
    
    console.log('Mobile menu closed');
  }
  
  // Close menu when clicking the overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }
  
  // Desktop dropdown functionality
  const desktopDropdownToggle = document.getElementById('pre-weddings-dropdown-toggle');
  const desktopDropdownMenu = document.getElementById('pre-weddings-dropdown-menu');
  
  if (desktopDropdownToggle && desktopDropdownMenu) {
    // Set initial states
    desktopDropdownMenu.style.opacity = '0';
    desktopDropdownMenu.style.visibility = 'hidden';
    desktopDropdownMenu.style.pointerEvents = 'none';
    
    desktopDropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Close any legacy dropdowns
      legacyDropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
      });
      
      // If already shown, hide with animation
      if (desktopDropdownMenu.classList.contains('show')) {
        desktopDropdownMenu.style.opacity = '0';
        desktopDropdownMenu.style.transform = 'translateX(-50%) translateY(-10px)';
        
        // After animation completes, hide the menu
        setTimeout(() => {
          desktopDropdownMenu.style.visibility = 'hidden';
          desktopDropdownMenu.style.pointerEvents = 'none';
          desktopDropdownMenu.classList.remove('show');
        }, 800); // Increased to 800ms for smoother animation
      } else {
        // Show with animation
        desktopDropdownMenu.style.visibility = 'visible';
        desktopDropdownMenu.style.pointerEvents = 'auto';
        
        // Force reflow
        void desktopDropdownMenu.offsetWidth;
        
        desktopDropdownMenu.style.opacity = '1';
        desktopDropdownMenu.style.transform = 'translateX(-50%) translateY(0)';
        desktopDropdownMenu.classList.add('show');
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (desktopDropdownMenu.classList.contains('show') && 
          !desktopDropdownToggle.contains(e.target) && 
          !desktopDropdownMenu.contains(e.target)) {
          
        // Hide with animation
        desktopDropdownMenu.style.opacity = '0';
        desktopDropdownMenu.style.transform = 'translateX(-50%) translateY(-10px)';
        
        // After animation completes, hide the menu
        setTimeout(() => {
          desktopDropdownMenu.style.visibility = 'hidden';
          desktopDropdownMenu.style.pointerEvents = 'none';
          desktopDropdownMenu.classList.remove('show');
        }, 800); // Increased to 800ms for smoother animation
      }
    });
  }
  
  // Mobile dropdown functionality
  const mobileDropdownBtn = document.getElementById('mobile-dropdown-btn');
  const mobileSubmenu = document.querySelector('.mobile-submenu');
  
  if (mobileDropdownBtn && mobileSubmenu) {
    mobileDropdownBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle active class for the button
      this.classList.toggle('active');
      
      // Toggle show class for the submenu
      mobileSubmenu.classList.toggle('show');
      console.log('Mobile submenu toggled');
    });
  }
});
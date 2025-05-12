document.addEventListener('DOMContentLoaded', function() {
    console.log("Scroll-up.js loaded and executing");
    // Scroll to top functionality
    const scrollUp = document.getElementById('scrollUp');
    if (scrollUp) {
        console.log("Scroll-up button found and event listener attached");
        scrollUp.addEventListener('click', function() {
            console.log("Scroll-up button clicked");
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.log("Warning: Scroll-up button not found on this page");
    }
});

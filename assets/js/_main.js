$(document).ready(function(){
  // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);
  
  // FitVids init
  fitvids();

  // TOC Toggle functionality
  document.addEventListener('DOMContentLoaded', function() {
      const tocToggle = document.querySelector('.toc__toggle');
      if (tocToggle) {
          tocToggle.addEventListener('click', function() {
              document.querySelector('.toc').classList.toggle('is-hidden');
          });
      }
  });

  // Follow menu drop down
  // ... rest of the existing code ...
});

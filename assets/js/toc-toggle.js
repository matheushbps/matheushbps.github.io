document.addEventListener('DOMContentLoaded', function() {
    const toc = document.querySelector('.toc');
    if (toc) {
        // Create and insert toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toc__toggle';
        toggleButton.setAttribute('aria-label', 'Toggle table of contents');
        toggleButton.innerHTML = '≡';
        toc.insertBefore(toggleButton, toc.firstChild);

        // Add click handler
        toggleButton.addEventListener('click', function() {
            toc.classList.toggle('is-hidden');
        });
    }
});
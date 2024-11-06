document.addEventListener('DOMContentLoaded', function() {
    const toc = document.querySelector('.toc');
    const mainContent = document.querySelector('.page__content');
    
    if (toc) {
        // Create and insert toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toc__toggle';
        toggleButton.setAttribute('aria-label', 'Toggle table of contents');
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleButton.innerHTML = '▼';
        toggleButton.style.transition = 'transform 0.3s';
        toc.insertBefore(toggleButton, toc.firstChild);

        // Add click handler with content adjustment
        toggleButton.addEventListener('click', function() {
            const isHidden = toc.classList.contains('is-hidden');
            toc.classList.toggle('is-hidden');
            if (mainContent) {
                mainContent.style.marginRight = isHidden ? '270px' : '0';
            }
            toggleButton.setAttribute('aria-expanded', !isHidden);
            this.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        });

        // Add keyboard support
        toggleButton.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    }
});
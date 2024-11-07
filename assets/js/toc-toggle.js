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

        // Create show button
        const showButton = document.createElement('button');
        showButton.className = 'toc-show-button';
        showButton.innerHTML = 'Show table of contents';
        document.body.appendChild(showButton);

        // Toggle function
        function toggleTOC(show) {
            toc.classList.toggle('is-hidden', !show);
            showButton.classList.toggle('show', !show);
            
            if (mainContent) {
                mainContent.style.marginRight = show ? '270px' : '0';
            }
            toggleButton.setAttribute('aria-expanded', show);
            toggleButton.style.transform = show ? 'rotate(0deg)' : 'rotate(180deg)';
        }

        // Add click handlers
        toggleButton.addEventListener('click', () => {
            toggleTOC(false);
        });
        
        showButton.addEventListener('click', () => {
            toggleTOC(true);
        });

        // Add keyboard support
        toggleButton.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });

        showButton.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    }
});
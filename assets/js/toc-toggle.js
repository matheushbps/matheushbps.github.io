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
        showButton.innerHTML = '☰ Show TOC';
        document.body.appendChild(showButton);

        // Toggle function
        function toggleTOC(show) {
            const isHidden = show === undefined ? toc.classList.contains('is-hidden') : !show;
            toc.classList.toggle('is-hidden', !isHidden);
            showButton.classList.toggle('show', !isHidden);
            
            if (mainContent) {
                mainContent.style.marginRight = isHidden ? '270px' : '0';
            }
            toggleButton.setAttribute('aria-expanded', isHidden);
            toggleButton.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        }

        // Add click handlers
        toggleButton.addEventListener('click', () => {
            toggleTOC();
            showButton.classList.toggle('show', true);
        });
        
        showButton.addEventListener('click', () => {
            toggleTOC(true);
            showButton.classList.toggle('show', false);
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
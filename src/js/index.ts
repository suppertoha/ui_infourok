document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-dropdown-container]').forEach((container) => {
    const dropdown = container as HTMLElement;
    let dropdownHandler: ((e: Event) => void) | null = null;

    function attachDropdownMenu() {
      if (dropdownHandler) return;

      dropdownHandler = (e: Event) => {
        const target = (e.target as HTMLElement).closest('[data-dropdown-toggle]');
        if (target) {
          toggleItem(target as HTMLElement);
        }
      };

      dropdown.addEventListener('click', dropdownHandler);
    }

    function detachDropdownMenu() {
      if (!dropdownHandler) return;

      dropdown.removeEventListener('click', dropdownHandler);
      dropdownHandler = null;
    }

    function toggleItem(ask: HTMLElement) {
      const answer = ask.nextElementSibling as HTMLElement | null;
      if (!answer || !answer.hasAttribute('data-dropdown-content')) return;

      if (answer.classList.contains('active')) {
        jsHeightAnimation(answer, true, () => {
          ask.classList.remove('active');
          answer.classList.remove('active');
          answer.style.height = '';
        });
      } else {
        ask.classList.add('active');
        answer.classList.add('active');

        answer.style.height = '0px';
        jsHeightAnimation(answer, false, () => {
          answer.style.height = 'auto';
        });
      }
    }

    function jsHeightAnimation(el: HTMLElement, isReverse = false, onFinish = () => {}) {
      if ((el as any).jsAnimated) return;
      (el as any).jsAnimated = true;

      const fullHeight = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';

      const animate = el.animate(
        [{ height: isReverse ? fullHeight : '0px' }, { height: isReverse ? '0px' : fullHeight }],
        { duration: 300, easing: 'ease-in-out' },
      );

      animate.addEventListener('finish', () => {
        (el as any).jsAnimated = false;
        el.style.overflow = '';
        if (isReverse) {
          el.style.height = '0px';
        }
        onFinish();
      });
    }

    function shouldActivateDropdown(): boolean {
      if (!dropdown.hasAttribute('data-dropdown-responsive')) return true;
      const maxWidth =
        parseInt(dropdown.getAttribute('data-dropdown-max-width') || '100', 10) ||
        window.innerWidth;
      return window.innerWidth <= maxWidth;
    }

    function handleResize() {
      if (shouldActivateDropdown()) {
        attachDropdownMenu();
      } else {
        detachDropdownMenu();
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
  });
});

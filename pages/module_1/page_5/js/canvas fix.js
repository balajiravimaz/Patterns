(function () {

    function isMobileLandscape() {
      return window.innerHeight <= 480 && window.innerWidth > window.innerHeight;
    }

    function applyMobileFix() {
      if (!isMobileLandscape()) return;

      /* ── Find the elements created by initSnakeGame() ── */
      const gameContainer = document.querySelector('.game-container');
      const gameWrapper = document.querySelector('.game-wrapper');
      const outerContainer = document.querySelector('.outer-container');
      const body = document.querySelector('.body');
      const header = document.querySelector('.header');
      const inst = document.querySelector('.inst');
      const contentBg = document.querySelector('.content-bg');

      if (!gameWrapper || !gameContainer) return;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      /* ── Heights: subtract header + instruction bar ── */
      const headerH = header ? header.offsetHeight : 55;
      const instH = inst ? inst.offsetHeight : 30;
      const availH = screenH - headerH - instH - 8; /* 8px buffer */

      /* ── Width: give canvas 78%, controls 22% ── */
      const controlsW = Math.round(screenW * 0.22);
      const canvasW = screenW - controlsW;

      /* ── Force gameContainer & gameWrapper to exact pixel size ── */
      gameContainer.style.cssText += `
      flex: none !important;
      width: ${canvasW}px !important;
      max-width: ${canvasW}px !important;
      height: ${availH}px !important;
    `;

      gameWrapper.style.cssText += `
      width: ${canvasW}px !important;
      height: ${availH}px !important;
      min-height: 0 !important;
    `;

      /* ── outer-container: give controls a proper home ── */
      if (outerContainer) {
        outerContainer.style.cssText += `
        width: ${controlsW}px !important;
        height: ${availH}px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      `;
      }

      /* ── body flex row ── */
      if (body) {
        body.style.cssText += `
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        height: ${availH}px !important;
        padding-bottom: 0 !important;
      `;
      }

      /* ── Now re-trigger resizeCanvas so tile math uses new size ── */
      /* ── Now re-trigger resizeCanvas so tile math uses new size ── */
      if (typeof resizeCanvas === 'function') {
        resizeCanvas();

        // ── MOBILE ONLY: recalculate with fewer tiles so grid cells are bigger ──
        const rect = gameWrapper.getBoundingClientRect();
        if (rect.width && rect.height) {
          tileCountX = 16;
          tileCountY = 8;

          const padding = 30;
          const availableWidth = rect.width - padding * 2;
          const availableHeight = rect.height - padding * 2;

          const sizeX = availableWidth / tileCountX;
          const sizeY = availableHeight / tileCountY;

          tileSize = Math.min(sizeX, sizeY);

          const usedWidth = tileCountX * tileSize;
          const usedHeight = tileCountY * tileSize;

          gridOffsetX = (rect.width - usedWidth) / 2;
          gridOffsetY = (rect.height - usedHeight) / 2;

          render();
        }
        // ── END MOBILE TILE OVERRIDE ──
      }
    }

    /* ── Run after DOM is ready ── */
    function init() {
      applyMobileFix();
      setTimeout(applyMobileFix, 200); /* second pass after any async layout */
      setTimeout(applyMobileFix, 600);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    window.addEventListener('load', function () {
      applyMobileFix();
      setTimeout(applyMobileFix, 300);
    });

    window.addEventListener('orientationchange', function () {
      setTimeout(applyMobileFix, 300);
      setTimeout(applyMobileFix, 700);
    });

    let _t;
    window.addEventListener('resize', function () {
      clearTimeout(_t);
      _t = setTimeout(applyMobileFix, 150);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function () {
        clearTimeout(_t);
        _t = setTimeout(applyMobileFix, 150);
      });
    }

  })();
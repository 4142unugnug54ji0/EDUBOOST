(() => {
  const isAndroidWebView = /EduBoostWebView/i.test(navigator.userAgent);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  if (isAndroidWebView || isMobile) {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.name = "viewport";
      document.head.appendChild(viewport);
    }
    viewport.content = isAndroidWebView
      ? "width=1280,height=600,initial-scale=1,maximum-scale=1,user-scalable=no"
      : "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no";
  }

  if (!/^quarter[1-4]week[1-8]_le\.html$/i.test(location.pathname.split("/").pop())) {
    const music = new Audio("bgmusic.mp3");
    const musicVolume = 0.3;
    const positionKey = "eduBackgroundMusicPosition";
    let fadeTimer = null;
    let musicStarted = false;
    let musicStartPending = false;
    let leavingPage = false;

    music.loop = true;
    music.preload = "auto";
    music.volume = 0;

    let savedPosition = NaN;
    try {
      savedPosition = Number(sessionStorage.getItem(positionKey));
    } catch (error) {
      console.error("Background music position could not be read:", error);
    }
    if (Number.isFinite(savedPosition) && savedPosition >= 0) {
      const restorePosition = () => {
        if (Number.isFinite(music.duration) && music.duration > 0) {
          music.currentTime = savedPosition % music.duration;
        }
      };
      if (music.readyState >= 1) restorePosition();
      else music.addEventListener("loadedmetadata", restorePosition, { once: true });
    }

    const fadeMusic = (targetVolume, duration, pauseWhenSilent = false) => {
      window.clearInterval(fadeTimer);
      const initialVolume = music.volume;
      const startedAt = performance.now();
      fadeTimer = window.setInterval(() => {
        const progress = Math.min((performance.now() - startedAt) / duration, 1);
        music.volume = initialVolume + (targetVolume - initialVolume) * progress;
        if (progress === 1) {
          window.clearInterval(fadeTimer);
          if (pauseWhenSilent) {
            music.pause();
            musicStarted = false;
          }
        }
      }, 30);
    };

    const startMusic = () => {
      if (leavingPage || musicStarted || musicStartPending) return;
      musicStartPending = true;
      music.play().then(() => {
        musicStartPending = false;
        musicStarted = true;
        fadeMusic(leavingPage ? 0 : musicVolume, leavingPage ? 200 : 1200, leavingPage);
        document.removeEventListener("pointerdown", startMusic);
        document.removeEventListener("keydown", startMusic);
      }).catch(error => {
        musicStartPending = false;
        if (error.name !== "NotAllowedError") {
          console.error("Background music could not be played:", error);
        }
      });
    };

    document.addEventListener("pointerdown", startMusic);
    document.addEventListener("keydown", startMusic);
    startMusic();

    const fadeOutMusic = () => {
      leavingPage = true;
      if (musicStarted) {
        try {
          sessionStorage.setItem(positionKey, String(music.currentTime));
        } catch (error) {
          console.error("Background music position could not be saved:", error);
        }
        fadeMusic(0, 700, true);
      }
    };

    window.eduFadeBackgroundMusic = fadeOutMusic;
    window.addEventListener("pagehide", fadeOutMusic);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        if (musicStarted) fadeMusic(0, 500, true);
        return;
      }
      leavingPage = false;
      if (music.paused) startMusic();
      else fadeMusic(musicVolume, 500);
    });
    window.addEventListener("pageshow", () => {
      leavingPage = false;
      if (music.paused) startMusic();
      else fadeMusic(musicVolume, 500);
    });
  }

  const style = document.createElement("style");
  style.textContent = `
    body.edu-sidebar-page {
      --edu-sidebar-width: 244px;
      box-sizing: border-box;
      margin-left: var(--edu-sidebar-width) !important;
      width: calc(100% - var(--edu-sidebar-width)) !important;
      transition: margin-left 0.2s ease, width 0.2s ease;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    html.edu-sidebar-page,
    body.edu-sidebar-page {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    html.edu-sidebar-page::-webkit-scrollbar,
    body.edu-sidebar-page::-webkit-scrollbar,
    body.edu-sidebar-page *::-webkit-scrollbar,
    .edu-sidebar::-webkit-scrollbar,
    .edu-sidebar *::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    body.edu-sidebar-page.edu-sidebar-page--collapsed {
      --edu-sidebar-width: 76px;
    }

    .edu-sidebar {
      --edu-sidebar-width: 244px;
      position: fixed;
      inset: 0 auto 0 0;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      width: var(--edu-sidebar-width);
      padding: 20px;
      overflow-x: hidden;
      overflow-y: auto;
      background: #2c3e50;
      color: #fff;
      font-family: Arial, sans-serif;
      transition: width 0.2s ease, padding 0.2s ease;
    }

    .edu-sidebar,
    .edu-sidebar * {
      box-sizing: border-box;
    }

    body.edu-sidebar-page .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 0;
      padding: 8px 16px !important;
      background: transparent !important;
      color: #2c3e50;
    }

    body.edu-sidebar-page .header h2 {
      min-width: 0;
      margin: 0;
      color: #2c3e50;
      font-size: clamp(16px, 2vw, 22px) !important;
      line-height: 1.25;
      text-shadow: none;
    }

    body.edu-sidebar-page .header button {
      flex: 0 0 auto;
      min-height: 0;
      margin: 0;
      padding: 7px 12px !important;
      border-radius: 10px !important;
      font-size: 13px !important;
      letter-spacing: 0.3px;
      box-shadow: 0 3px 0 #22313f, 0 5px 8px rgba(0,0,0,0.2) !important;
    }

    body.edu-sidebar-page .header button::before {
      border-radius: 8px;
    }

    body.edu-sidebar-page .header button:hover {
      box-shadow: 0 4px 0 #22313f, 0 7px 10px rgba(0,0,0,0.24) !important;
    }

    .edu-sidebar__header {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      margin-bottom: 12px;
      white-space: nowrap;
    }

    .edu-sidebar__toggle {
      display: flex;
      flex: 0 0 40px;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #fff;
      font-size: 25px;
      cursor: pointer;
    }

    .edu-sidebar__toggle:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    .edu-sidebar__toggle img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }

    .edu-sidebar__title {
      overflow: hidden;
      color: inherit;
      font-size: 20px;
      font-weight: 700;
      text-decoration: none;
    }

    .edu-sidebar__title:hover {
      color: #d7e8ff;
    }

    .edu-sidebar__title:focus-visible {
      outline: 3px solid #f1c40f;
      outline-offset: 3px;
    }

    .edu-sidebar__nav {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      justify-content: space-between;
      min-height: 0;
    }

    .edu-sidebar__link {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 100%;
      min-height: 50px;
      margin: 6px 0;
      padding: 15px;
      border: none;
      border-radius: 15px;
      background: linear-gradient(to bottom, #4b6cb7, #34495e);
      color: white;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 6px 0 #22313f, 0 8px 15px rgba(0,0,0,0.3);
      transition: all 0.15s ease;
      position: relative;
    }

    .edu-sidebar__link::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 5%;
      width: 90%;
      height: 35%;
      border-radius: 12px;
      background: rgba(255,255,255,0.2);
      pointer-events: none;
    }

    .edu-sidebar__link > * {
      position: relative;
      z-index: 1;
    }

    .edu-sidebar__link[hidden] {
      display: none;
    }

    .edu-sidebar__link:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 0 #22313f, 0 12px 18px rgba(0,0,0,0.35);
    }

    .edu-sidebar__link:active {
      transform: translateY(5px);
      box-shadow: 0 1px 0 #22313f, 0 3px 6px rgba(0,0,0,0.25);
    }

    .edu-sidebar__link[aria-current="page"] {
      box-shadow: 0 6px 0 #22313f, 0 8px 15px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.16);
    }

    .edu-sidebar__quarters {
      width: 100%;
    }

    .edu-sidebar__quarter-toggle {
      list-style: none;
      cursor: pointer;
    }

    .edu-sidebar__quarter-toggle::-webkit-details-marker {
      display: none;
    }

    .edu-sidebar__quarter-chevron {
      margin-left: auto;
      transition: transform 0.15s ease;
    }

    .edu-sidebar__quarters[open] .edu-sidebar__quarter-chevron {
      transform: rotate(180deg);
    }

    .edu-sidebar__quarter-options {
      display: grid;
      gap: 2px;
      padding-left: 12px;
    }

    .edu-sidebar__quarter-link {
      min-height: 42px;
      margin: 4px 0;
      padding: 10px 12px;
      font-size: 14px;
    }

    @media (min-width: 901px) {
      .edu-sidebar__nav {
        justify-content: flex-start;
      }

      .edu-sidebar__link {
        min-height: 44px;
        margin: 3px 0;
        padding: 10px 12px;
      }

      .edu-sidebar__quarter-link {
        min-height: 38px;
        margin: 2px 0;
        padding: 8px 12px;
      }
    }

    body.edu-student-list-page .edu-sidebar {
      background: #bdece4;
      color: #20303b;
    }

    body.edu-student-list-page {
      --edu-sidebar-width: 244px;
    }

    body.edu-student-list-page:not(.edu-sidebar-page--collapsed) .edu-sidebar {
      --edu-sidebar-width: 244px;
    }

    body.edu-student-list-page .edu-sidebar__header {
      gap: 8px;
      min-height: 46px;
      margin-bottom: 12px;
    }

    body.edu-student-list-page .edu-sidebar__toggle {
      flex-basis: 44px;
      width: 44px;
      height: 44px;
      padding: 0;
    }

    body.edu-student-list-page .edu-sidebar__title {
      color: #27364a;
      font-size: 20px;
    }

    body.edu-student-list-page .edu-sidebar__link {
      min-height: 44px;
      margin: 3px 0;
      padding: 10px 12px;
      border-radius: 14px;
      background: transparent;
      color: #17252e;
      box-shadow: none;
      font-size: 16px;
    }

    body.edu-student-list-page .edu-sidebar__link::before {
      display: none;
    }

    body.edu-student-list-page .edu-sidebar__link:hover {
      transform: none;
      background: rgba(255, 255, 255, 0.52);
      box-shadow: none;
    }

    body.edu-student-list-page .edu-sidebar__link:active,
    body.edu-student-list-page .edu-sidebar__link[aria-current="page"] {
      transform: none;
      background: #fff;
      box-shadow: none;
    }

    body.edu-student-list-page .edu-sidebar__quarter-link {
      min-height: 40px;
      margin: 2px 0;
      padding: 8px 12px;
    }

    .edu-sidebar__icon {
      display: inline-flex;
      flex: 0 0 24px;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      object-fit: contain;
      font-size: 21px;
      line-height: 1;
    }

    .edu-sidebar__link:focus-visible,
    .edu-sidebar__toggle:focus-visible {
      outline: 3px solid #f1c40f;
      outline-offset: 2px;
    }

    .edu-sidebar.edu-sidebar--collapsed {
      --edu-sidebar-width: 76px;
      padding: 16px 10px;
    }

    .edu-sidebar--collapsed .edu-sidebar__header {
      justify-content: center;
    }

    .edu-sidebar--collapsed .edu-sidebar__title,
    .edu-sidebar--collapsed .edu-sidebar__label {
      display: none;
    }

    .edu-sidebar--collapsed .edu-sidebar__link {
      justify-content: center;
      padding: 15px 8px;
    }

    .edu-sidebar--collapsed .edu-sidebar__quarter-chevron {
      display: none;
    }

    .edu-sidebar--collapsed .edu-sidebar__quarter-options {
      padding-left: 0;
    }

    @media (max-height: 700px) {
      .edu-sidebar {
        padding: 6px 10px;
      }

      .edu-sidebar__header {
        min-height: 30px;
        margin-bottom: 2px;
      }

      .edu-sidebar__toggle {
        flex-basis: 30px;
        width: 30px;
        height: 30px;
        font-size: 20px;
      }

      .edu-sidebar__title {
        font-size: 15px;
      }

      .edu-sidebar .edu-sidebar__link {
        height: 40px !important;
        min-height: 40px !important;
        margin: 5px 0 !important;
        padding: 4px 8px;
        gap: 6px;
        border-radius: 10px;
        font-size: 12px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .edu-sidebar__nav {
        justify-content: flex-start;
      }

      .edu-sidebar__link::before {
        border-radius: 7px;
      }

      .edu-sidebar__icon {
        flex-basis: 19px;
        width: 19px;
        height: 19px;
        font-size: 17px;
      }

      .edu-sidebar.edu-sidebar--collapsed {
        padding: 6px;
      }

      .edu-sidebar--collapsed .edu-sidebar__link {
        padding: 4px 2px;
      }
    }

    @media (max-height: 450px) {
      .edu-sidebar {
        padding: 6px 10px;
      }

      .edu-sidebar__header {
        min-height: 30px;
        margin-bottom: 2px;
      }

      .edu-sidebar__toggle {
        flex-basis: 30px;
        width: 30px;
        height: 30px;
        font-size: 20px;
      }

      .edu-sidebar__title {
        font-size: 15px;
      }

      .edu-sidebar.edu-sidebar .edu-sidebar__link {
        height: 26px !important;
        min-height: 26px !important;
        margin: 5px 0 !important;
        padding: 4px 8px;
        gap: 6px;
        border-radius: 10px;
        font-size: 12px;
      }

      .edu-sidebar__link::before {
        border-radius: 7px;
      }

      .edu-sidebar__icon {
        flex-basis: 19px;
        width: 19px;
        height: 19px;
        font-size: 17px;
      }

      .edu-sidebar.edu-sidebar--collapsed {
        padding: 6px 6px;
      }

      .edu-sidebar--collapsed .edu-sidebar__link {
        padding: 4px 2px;
      }
    }

    @media (min-width: 901px) {
      body.edu-student-list-page .edu-sidebar .edu-sidebar__link {
        height: 47px !important;
        min-height: 47px !important;
        margin: 3px 0 !important;
        padding: 10px 12px;
      }

      body.edu-student-list-page .edu-sidebar .edu-sidebar__quarter-link {
        height: 40px !important;
        min-height: 40px !important;
        margin: 2px 0 !important;
        padding: 8px 12px;
      }
    }

    body.edu-sidebar-page .nav-buttons {
      left: var(--edu-sidebar-width) !important;
      width: calc(100vw - var(--edu-sidebar-width)) !important;
      z-index: 9999;
    }

    body.edu-sidebar-page .nav-buttons button:first-child {
      left: 20px !important;
    }

    body.edu-sidebar-page .nav-buttons button:last-child {
      right: 20px !important;
    }

    body.edu-sidebar-page .nav-buttons {
      display: none !important;
    }

    body.edu-sidebar-page .lesson.active {
      touch-action: pan-y;
    }

    body.edu-sidebar-page .lesson.edu-swipe-dragging {
      cursor: grabbing;
      user-select: none;
    }

    body.edu-sidebar-page .lesson.edu-swipe-out-next {
      animation: eduLessonSwipeOutNext 0.22s ease-in forwards;
      pointer-events: none;
    }

    body.edu-sidebar-page .lesson.edu-swipe-out-previous {
      animation: eduLessonSwipeOutPrevious 0.22s ease-in forwards;
      pointer-events: none;
    }

    body.edu-sidebar-page .lesson.edu-swipe-in-next {
      animation: eduLessonSwipeInNext 0.28s ease-out both;
    }

    body.edu-sidebar-page .lesson.edu-swipe-in-previous {
      animation: eduLessonSwipeInPrevious 0.28s ease-out both;
    }

    @keyframes eduLessonSwipeOutNext {
      to { opacity: 0; transform: translateX(-18%); }
    }

    @keyframes eduLessonSwipeOutPrevious {
      to { opacity: 0; transform: translateX(18%); }
    }

    @keyframes eduLessonSwipeInNext {
      from { opacity: 0; transform: translateX(18%); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes eduLessonSwipeInPrevious {
      from { opacity: 0; transform: translateX(-18%); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 640px) {
      body.edu-sidebar-page .nav-buttons {
        top: auto !important;
        bottom: 16px !important;
        left: var(--edu-sidebar-width) !important;
        display: flex !important;
        align-items: stretch;
        justify-content: space-between;
        gap: 12px;
        width: calc(100vw - var(--edu-sidebar-width) - 20px) !important;
        padding: 0;
        transform: none !important;
      }

      body.edu-sidebar-page .nav-buttons button,
      body.edu-sidebar-page .nav-buttons button:first-child,
      body.edu-sidebar-page .nav-buttons button:last-child {
        position: static !important;
        flex: 1 1 0;
        width: auto !important;
        min-width: 0;
        min-height: 46px;
        margin: 0;
        padding: 8px 4px;
        font-size: 12px;
        line-height: 1.15;
        white-space: normal;
      }
    }

    @media (max-width: 900px) and (orientation: landscape) {
      body.edu-sidebar-page,
      body.edu-sidebar-page * {
        box-sizing: border-box;
      }

      body.edu-sidebar-page .header {
        gap: 8px;
        padding: 5px 10px !important;
      }

      body.edu-sidebar-page .header h2 {
        font-size: clamp(14px, 2.4vw, 20px) !important;
      }

      body.edu-sidebar-page .header button {
        padding: 5px 9px !important;
        font-size: 12px !important;
      }

      body.edu-sidebar-page .tabs {
        display: flex;
        flex-wrap: nowrap;
        gap: 8px;
        padding: 8px;
      }

      body.edu-sidebar-page .tabs button {
        flex: 1 1 0;
        min-width: 0;
        padding: clamp(8px, 2.2vh, 14px) 4px;
        border-radius: 14px;
        font-size: clamp(13px, 2.6vw, 20px);
        line-height: 1.1;
      }

      body.edu-sidebar-page .tabs button.active {
        transform: translateY(3px);
      }

      body.edu-sidebar-page .content,
      body.edu-sidebar-page .container {
        padding: clamp(8px, 2vh, 16px);
      }

      body.edu-sidebar-page .card {
        width: min(100%, 960px);
        min-width: 0;
        min-height: 0;
        padding: clamp(14px, 3vh, 28px);
        border-radius: 28px;
      }

      body.edu-sidebar-page .card h1 {
        font-size: clamp(22px, 4vw, 34px);
      }

      body.edu-sidebar-page .card h2,
      body.edu-sidebar-page .card h3 {
        font-size: clamp(17px, 3vw, 25px);
      }

      body.edu-sidebar-page .card p,
      body.edu-sidebar-page .instructions {
        font-size: clamp(14px, 2.4vw, 20px);
        line-height: 1.4;
      }

      body.edu-sidebar-page .game-container {
        width: 100%;
        max-width: 900px;
        padding: 4px 8px 10px;
      }

      body.edu-sidebar-page .game-title {
        margin: 4px 0 6px;
        font-size: clamp(22px, 4vw, 34px);
      }

      body.edu-sidebar-page .game-instruction {
        margin: 4px 0 8px;
        font-size: clamp(14px, 2.6vw, 20px);
      }

      body.edu-sidebar-page .game-img {
        width: clamp(58px, 14vh, 100px);
        height: clamp(58px, 14vh, 100px);
        margin: 2px auto 6px;
      }

      body.edu-sidebar-page .progress-wrap {
        margin-bottom: 8px;
      }

      body.edu-sidebar-page .progress-bar {
        margin: 8px auto 12px;
      }

      body.edu-sidebar-page .word-box {
        gap: clamp(6px, 1.5vw, 14px);
        margin: 8px auto 12px;
      }

      body.edu-sidebar-page .letter-box,
      body.edu-sidebar-page .drop-zone {
        width: clamp(44px, 9vh, 68px);
        height: clamp(44px, 9vh, 68px);
        border-radius: 12px;
        font-size: clamp(24px, 5vh, 36px);
      }

      body.edu-sidebar-page .letters {
        min-height: 100px;
        margin-bottom: 8px;
      }

      body.edu-sidebar-page .game-message {
        margin-top: 8px;
        font-size: clamp(16px, 3vh, 24px);
      }

      body.edu-sidebar-page .drag-letter {
        width: clamp(52px, 10vh, 68px);
        height: clamp(52px, 10vh, 68px);
        border-radius: 14px;
        font-size: clamp(26px, 5vh, 36px);
      }
    }

    @media (orientation: landscape) and (max-height: 700px) {
      body.edu-sidebar-page,
      body.edu-sidebar-page * {
        box-sizing: border-box;
      }

      body.edu-sidebar-page.edu-lesson-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        height: 100dvh;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-quarter-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        height: 100dvh;
        min-height: 0;
      }

      body.edu-sidebar-page .header {
        gap: 8px;
        padding: 4px 12px !important;
      }

      body.edu-sidebar-page .header h2 {
        font-size: clamp(16px, 2.4vh, 20px) !important;
      }

      body.edu-sidebar-page .header button {
        padding: 5px 9px !important;
        font-size: 12px !important;
      }

      body.edu-sidebar-page .tabs {
        gap: 10px;
        flex: 0 0 auto;
        margin-bottom: 6px !important;
        padding: 0 8px;
      }

      body.edu-sidebar-page .tabs button {
        min-width: 0;
        padding: clamp(9px, 2vh, 13px) 8px;
        font-size: clamp(16px, 2.7vh, 20px);
        line-height: 1.1;
      }

      body.edu-sidebar-page .card {
        width: min(74%, 960px);
        flex: 1 1 0%;
        height: auto;
        min-height: 0;
        margin: 8px auto 14px;
        padding: clamp(38px, 6vh, 44px) clamp(38px, 5vw, 58px);
      }

      body.edu-sidebar-page .card h1,
      body.edu-sidebar-page .card h2,
      body.edu-sidebar-page .card h3 {
        font-size: clamp(22px, 4vh, 26px) !important;
        line-height: 1.2;
      }

      body.edu-sidebar-page .card p {
        font-size: clamp(17px, 2.8vh, 20px) !important;
        line-height: 1.4 !important;
      }

      body.edu-sidebar-page.edu-le-page .card h3 {
        font-size: clamp(26px, 4.6vh, 30px) !important;
      }

      body.edu-sidebar-page.edu-le-page .card p {
        font-size: clamp(22px, 4vh, 25px) !important;
        line-height: 1.45 !important;
      }

      body.edu-sidebar-page.edu-le-page .card p span.active {
        border-radius: 5px;
        background: rgba(255, 225, 0, 0.28) !important;
        color: #a89f00 !important;
        font-size: inherit !important;
        font-weight: 900;
      }

      body.edu-sidebar-page.edu-le-page .card p span.done {
        color: #c7c710;
      }

      body.edu-sidebar-page.edu-lesson-page > .container {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
        padding: 6px 20px 10px;
      }

      body.edu-sidebar-page.edu-lesson-page > .content {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
        padding: 6px 20px 10px;
      }

      body.edu-sidebar-page.edu-quarter-page > .container {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        padding: 8px 20px 14px;
      }

      body.edu-sidebar-page.edu-quarter-page .weeks {
        display: grid;
        flex: 1 1 auto;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));
        gap: clamp(8px, 1.6vh, 12px);
        min-height: 0;
        width: 100%;
      }

      body.edu-sidebar-page.edu-quarter-page .week {
        display: grid;
        grid-template-columns: clamp(52px, 7vw, 88px) minmax(0, 1fr);
        align-items: center;
        justify-items: center;
        gap: clamp(8px, 1.8vw, 18px);
        min-height: 0;
        padding: clamp(8px, 1.6vh, 14px);
        font-size: clamp(18px, 3.8vh, 30px);
        line-height: 1.1;
      }

      body.edu-sidebar-page.edu-quarter-page .week-lesson-gif {
        display: block;
        width: clamp(48px, 7vw, 82px);
        height: clamp(38px, 9vh, 60px);
        object-fit: contain;
      }

      body.edu-sidebar-page.edu-quarter-page .week-label {
        min-width: 0;
        text-align: center;
      }

      body.edu-sidebar-page.edu-lesson-page .day:not(.hidden) {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .question {
        flex: 0 0 auto !important;
        margin: 0 0 6px !important;
        padding: 4px 8px !important;
        font-size: clamp(15px, 3vh, 19px) !important;
        line-height: 1.25 !important;
        text-align: center;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card {
        flex: 1 1 0 !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        margin: 0 auto 8px !important;
        padding: clamp(12px, 2vh, 18px) !important;
        gap: clamp(12px, 2vw, 24px) !important;
        overflow-y: auto;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card h3 {
        margin: 0 0 8px;
        font-size: clamp(17px, 3vh, 21px);
        line-height: 1.2;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-card {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.5vh, 12px);
        padding: 38px clamp(38px, 5vw, 58px) !important;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-instruction {
        flex: 0 0 auto;
        margin: 0 !important;
        font-size: clamp(16px, 2.8vh, 20px) !important;
        line-height: 1.25 !important;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-columns {
        display: grid;
        flex: 1 1 auto;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(14px, 3vw, 36px);
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column {
        display: flex;
        min-width: 0;
        flex-direction: column;
        gap: clamp(5px, 1vh, 8px);
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column h3 {
        flex: 0 0 auto;
        margin: 0 0 2px;
        font-size: clamp(17px, 3vh, 22px);
        line-height: 1.2;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column .match-word,
      body.edu-sidebar-page.edu-lesson-page .day3-match-column .match-img {
        display: flex;
        flex: 1 1 0;
        align-items: center;
        justify-content: center;
        min-width: 0;
        min-height: 34px;
        padding: 4px 10px;
        font-size: clamp(18px, 3.4vh, 26px);
        line-height: 1.1;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column .matched {
        background: linear-gradient(to bottom, #2ecc71, #27ae60);
        color: #fff;
        pointer-events: none;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column .incorrect {
        background: linear-gradient(to bottom, #ff6b6b, #c0392b);
        color: #fff;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-card > .score-btn {
        flex: 0 0 auto;
        width: min(60%, 420px);
        min-height: 44px;
        margin: 2px auto 0;
        padding: 8px 12px;
        font-size: clamp(16px, 2.8vh, 20px);
        line-height: 1.15;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card .match-word,
      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card .match-img {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        min-height: clamp(40px, 7vh, 52px);
        padding: 6px 10px;
        font-size: clamp(18px, 3.6vh, 25px);
        line-height: 1.15;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .score-btn {
        flex: 0 0 auto;
        width: min(70%, 360px);
        min-height: 44px;
        margin: 0 auto 6px;
        padding: 8px 12px;
        font-size: clamp(15px, 2.8vh, 19px);
        line-height: 1.15;
      }

      body.edu-sidebar-page.edu-lesson-page .day:not(.hidden) > .lesson.active {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page .lesson.active {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page .lesson.active > .card {
        flex: 1 1 auto;
      }

      body.edu-sidebar-page.edu-lesson-page .day:not(.hidden) > .lesson.active > .card {
        flex: 1 1 auto;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page {
        display: block;
        height: auto;
        min-height: 100vh;
        overflow-y: auto;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page > .content {
        display: block;
        flex: none;
        min-height: 0;
        padding: 8px 12px 24px;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page .day:not(.hidden),
      body.edu-sidebar-page.edu-lesson-page.edu-le-page .lesson.active {
        display: block;
        flex: none;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page .card {
        box-sizing: border-box;
        width: min(100%, 760px);
        height: auto;
        min-height: 0;
        margin: 0 auto 20px;
        padding: 24px 28px;
        overflow: visible;
        border-radius: 28px !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page .card::before {
        inset: 10px;
        border-width: 2px;
        border-radius: 22px !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page .card h3 {
        margin: 0 0 8px;
        font-size: 20px !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page .card p {
        margin: 8px 0;
        font-size: 19px !important;
        line-height: 1.45 !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-le-page .speak-btn {
        width: auto;
        min-width: 132px;
        max-width: 100%;
        margin: 8px auto 0;
        padding: 8px 16px;
        border-radius: 14px;
        font-size: 16px;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page {
        display: block;
        height: auto;
        min-height: 100vh;
        overflow-y: auto;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page > .container {
        display: block;
        flex: none;
        min-height: 0;
        padding: 8px 12px 24px;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .day:not(.hidden),
      body.edu-sidebar-page.edu-lesson-page.edu-las-page .lesson.active {
        display: block;
        flex: none;
        min-height: 0;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card {
        box-sizing: border-box;
        width: min(100%, 760px);
        height: auto;
        min-height: 0;
        margin: 0 auto 20px;
        padding: 20px 24px;
        overflow: visible;
        border-radius: 28px !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card::before {
        inset: 10px;
        border-width: 2px;
        border-radius: 22px !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card > .question:first-child {
        margin-bottom: 6px;
        font-size: 17px;
        line-height: 1.3;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card > .question:nth-child(2) {
        margin: 0 0 8px;
        font-size: 21px;
        line-height: 1.25;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card > img:not(.card-icon) {
        width: 54px !important;
        height: 54px !important;
        margin: 4px auto !important;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card .options {
        gap: 8px;
        margin-top: 8px;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card .option-btn {
        min-height: 58px;
        padding: 6px;
        border-radius: 12px;
        font-size: 23px;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card .card-icon {
        height: 38px;
      }

      body.edu-sidebar-page.edu-lesson-page.edu-las-page .card .score-btn {
        width: min(60%, 360px);
        min-height: 40px;
        margin: 10px auto 0;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 16px;
      }

      body.edu-sidebar-page .card > .question {
        font-size: clamp(24px, 4.5vh, 30px);
        line-height: 1.25;
      }

      body.edu-sidebar-page .card > .question:first-child {
        margin-bottom: 6px;
        font-size: clamp(18px, 3.2vh, 21px);
        line-height: 1.25;
      }

      body.edu-sidebar-page .card > .question:first-child br {
        display: none;
      }

      body.edu-sidebar-page .card > .question:nth-child(2) {
        margin: 0 0 8px;
        font-size: clamp(24px, 4.5vh, 30px);
        line-height: 1.2;
      }

      body.edu-sidebar-page .card > img:not(.card-icon) {
        width: clamp(72px, 14vh, 92px) !important;
        height: clamp(72px, 14vh, 92px) !important;
        margin: 4px auto !important;
      }

      body.edu-sidebar-page .card .options {
        gap: 10px;
        margin-top: 8px;
      }

      body.edu-sidebar-page .card .option-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        min-height: clamp(70px, 13vh, 86px);
        padding: 8px;
        border-radius: 15px;
        font-size: clamp(22px, 4vh, 30px);
        line-height: 1.15;
      }

      body.edu-sidebar-page .card .card-icon {
        width: auto;
        max-width: 100%;
        height: clamp(44px, 9vh, 58px);
        object-fit: contain;
      }

      body.edu-sidebar-page .card .score-btn {
        width: min(70%, 420px);
        margin: 12px auto 0;
        padding: 12px 16px;
        border-radius: 15px;
        font-size: clamp(16px, 2.8vh, 20px);
      }

      body.edu-sidebar-page .game-container {
        width: 100%;
        max-width: 900px;
        margin: 0;
        padding: 0 8px 8px;
      }

      body.edu-sidebar-page .game-title {
        margin: 0 0 4px;
        font-size: clamp(26px, 4.5vh, 34px);
        line-height: 1.15;
      }

      body.edu-sidebar-page .game-instruction {
        margin: 4px 0 6px;
        font-size: clamp(15px, 2.8vh, 19px);
        line-height: 1.25;
      }

      body.edu-sidebar-page .progress-wrap {
        margin-bottom: 4px;
      }

      body.edu-sidebar-page .progress-bar {
        height: 12px;
        margin: 4px auto 8px;
      }

      body.edu-sidebar-page .game-img {
        width: clamp(62px, 13vh, 78px);
        height: clamp(62px, 13vh, 78px);
        margin: 2px auto 4px;
      }

      body.edu-sidebar-page .word-box {
        gap: 8px;
        margin: 6px auto 8px;
      }

      body.edu-sidebar-page .letter-box,
      body.edu-sidebar-page .drop-zone {
        width: clamp(48px, 9vh, 58px);
        height: clamp(48px, 9vh, 58px);
        border-radius: 12px;
        font-size: clamp(26px, 5vh, 34px);
      }

      body.edu-sidebar-page .letters {
        min-height: 68px;
        margin-bottom: 4px;
      }

      body.edu-sidebar-page .drag-letter {
        width: clamp(50px, 9vh, 58px);
        height: clamp(50px, 9vh, 58px);
        border-radius: 12px;
        font-size: clamp(25px, 4.5vh, 32px);
      }

      body.edu-sidebar-page .game-message {
        min-height: 0;
        margin-top: 4px;
        font-size: clamp(16px, 2.8vh, 22px);
      }
    }

    @media (orientation: landscape) and (max-height: 450px) {
      body.edu-sidebar-page.edu-lesson-page .tabs button {
        padding: 6px 4px;
        font-size: clamp(12px, 3.5vh, 15px);
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .question {
        margin-bottom: 3px !important;
        padding: 2px 6px !important;
        font-size: clamp(14px, 3.7vh, 16px) !important;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card {
        padding: 8px 12px !important;
        gap: 10px !important;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card h3 {
        position: relative;
        z-index: 1;
        width: fit-content;
        margin-bottom: 4px;
        padding: 0 6px;
        background: #f8f8f8;
        font-size: 16px;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card .match-word,
      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .card .match-img {
        height: 34px;
        min-height: 34px;
        padding: 0 6px;
        font-size: 15px;
        line-height: 1;
      }

      body.edu-sidebar-page.edu-lesson-page .part:not(.hidden) > .score-btn {
        min-height: 38px;
        padding: 6px 10px;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-card {
        gap: 6px;
        padding: 26px clamp(26px, 4vw, 36px) 34px !important;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-instruction {
        font-size: 14px !important;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-columns {
        gap: 10px;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column {
        gap: 2px;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column h3 {
        margin: 0;
        font-size: 15px;
        line-height: 1;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-column .match-word,
      body.edu-sidebar-page.edu-lesson-page .day3-match-column .match-img {
        min-height: 26px;
        padding: 2px 6px;
        font-size: 14px;
      }

      body.edu-sidebar-page.edu-lesson-page .day3-match-card > .score-btn {
        min-height: 36px;
        margin-top: 0;
        padding: 6px 10px;
        font-size: 14px;
      }
    }

    body.edu-site-theme,
    body.edu-index-page.dashboard-active {
      min-height: 100vh;
      background-color: #fff1df !important;
      background-image:
        linear-gradient(rgba(255,244,232,0.2),rgba(255,244,232,0.2)),
        url("student-list-decoration.svg") !important;
      background-size: cover, 600px auto !important;
      background-position: center, right -120px top 40px !important;
      background-repeat: no-repeat !important;
      background-attachment: fixed !important;
      color: #263342;
      font-family: "Poppins", Arial, sans-serif;
    }

    body.edu-site-theme .header,
    body.edu-index-page.dashboard-active .header {
      padding: 8px 16px !important;
      background: transparent !important;
      color: #263342 !important;
    }

    body.edu-site-theme .header h2,
    body.edu-index-page.dashboard-active .header h2 {
      color: #263342 !important;
      text-shadow: none !important;
    }

    body.edu-site-theme .header button,
    body.edu-index-page.dashboard-active .header button {
      background: #d8eafa !important;
      color: #263342 !important;
      box-shadow: 0 2px 5px rgba(40,70,95,0.16) !important;
    }

    body.edu-site-theme .header button::before,
    body.edu-index-page.dashboard-active .header button::before {
      content: none !important;
    }

    body.edu-site-theme .container,
    body.edu-site-theme .content,
    body.edu-site-theme .card,
    body.edu-site-theme .top-card,
    body.edu-site-theme .bulletin-section,
    body.edu-site-theme .file-box,
    body.edu-index-page.dashboard-active .value-card,
    body.edu-index-page.dashboard-active .bulletin-section {
      border-color: rgba(255,255,255,0.8);
      border-radius: 22px;
      background: rgba(255,255,255,0.84);
      box-shadow: 0 6px 22px rgba(91,74,55,0.12);
      color: #263342;
    }

    body.edu-week-menu-page .container,
    body.edu-week-menu-page .cards > .card {
      background: transparent !important;
      box-shadow: none !important;
    }

    body.edu-week-menu-page .cards > .card {
      color: #263342;
      text-shadow: 0 2px 8px rgba(38,51,66,0.12);
      box-shadow: 0 8px 0 #d8c49a, 0 12px 20px rgba(0,0,0,0.2) !important;
    }

    body.edu-week-menu-page .cards > .card:hover {
      box-shadow: 0 6px 0 #d8c49a, 0 10px 18px rgba(0,0,0,0.22) !important;
    }

    body.edu-week-menu-page .cards > .card:active {
      box-shadow: 0 0 0 #d8c49a, 0 4px 10px rgba(0,0,0,0.18) !important;
    }

    body.edu-bulletin-page .container {
      border-radius: 60px 90px 70px 100px / 80px 70px 90px 60px !important;
    }

    body.edu-bulletin-page .container::before {
      border-radius: 42px 72px 52px 82px / 62px 52px 72px 42px !important;
    }

    body.edu-quarter-page > .container {
      background: transparent !important;
      box-shadow: none !important;
    }

    body.edu-quarter-page .weeks > .week {
      display: grid;
      grid-template-columns: max-content max-content;
      align-items: center;
      justify-content: center;
      gap: clamp(12px, 2vw, 24px);
      text-align: left;
    }

    body.edu-quarter-page .weeks > .week {
      box-shadow: 0 8px 0 #b7dce0, 0 12px 20px rgba(0,0,0,0.2) !important;
    }

    body.edu-quarter-page .weeks > .week:hover {
      box-shadow: 0 6px 0 #b7dce0, 0 10px 18px rgba(0,0,0,0.22) !important;
    }

    body.edu-quarter-page .weeks > .week:active {
      box-shadow: 0 0 0 #b7dce0, 0 4px 10px rgba(0,0,0,0.18) !important;
    }

    body.edu-le-page .content,
    body.edu-las-page .container,
    body.edu-le-page .card,
    body.edu-las-page .card,
    body.edu-las-page .instructions {
      background: transparent !important;
      box-shadow: none !important;
    }

    body.edu-le-page .card,
    body.edu-las-page .card,
    body.edu-las-page .instructions {
      box-shadow: 0 8px 22px rgba(0,0,0,0.32) !important;
    }

    body.edu-le-page .card,
    body.edu-las-page .card {
      border-radius: 60px 90px 70px 100px / 80px 70px 90px 60px !important;
    }

    body.edu-las-page .instructions {
      border-radius: 40px 60px 50px 70px / 50px 40px 60px 40px !important;
    }

    body.edu-le-page .card::before,
    body.edu-las-page .card::before {
      border-radius: 42px 72px 52px 82px / 62px 52px 72px 42px !important;
    }

    body.edu-las-page .instructions::before {
      border-radius: 25px 45px 35px 55px / 35px 25px 45px 25px !important;
    }

    body.edu-le-page .lesson.active,
    body.edu-las-page .lesson.active {
      background: transparent !important;
      box-shadow: none !important;
    }

    body.edu-site-theme .week,
    body.edu-site-theme .lesson,
    body.edu-index-page.dashboard-active .value-card {
      border-color: #b7dce0;
      background: #e6f5f6;
      color: #263342;
      box-shadow: 0 4px 12px rgba(64,106,119,0.14);
    }

    body.edu-index-page.dashboard-active .value-card {
      border-style: solid;
      transform: none;
    }

    body.edu-site-theme .week:hover,
    body.edu-site-theme .lesson:hover {
      box-shadow: 0 7px 16px rgba(64,106,119,0.18);
    }

    body.edu-site-theme .lesson.active {
      background: #c8ebf3;
      box-shadow: inset 0 0 0 2px rgba(255,255,255,0.7);
    }

    body.edu-site-theme .row,
    body.edu-site-theme .item {
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }

    body.edu-site-theme .row {
      border-bottom: 1px solid #e8e4df;
    }

    body.edu-site-theme .row .rank,
    body.edu-site-theme .row .name,
    body.edu-site-theme .row .score,
    body.edu-site-theme .top-card,
    body.edu-site-theme .content h2,
    body.edu-site-theme .words,
    body.edu-site-theme ul {
      color: #35485a;
    }

    body.edu-site-theme .sample-label {
      background: #d8eee8;
      color: #35485a;
    }

    body.edu-site-theme .value-card h2,
    body.edu-site-theme .bulletin-section h2,
    body.edu-index-page.dashboard-active .value-card h2,
    body.edu-index-page.dashboard-active .bulletin-section h2 {
      color: #35485a;
    }

    body.edu-index-page.dashboard-active .value-card p {
      color: #263342;
    }

    body.edu-site-theme input:not([type="file"]),
    body.edu-site-theme select {
      border-color: #b6d2d6;
      border-radius: 14px;
    }

    body.edu-sidebar-page .edu-sidebar {
      background: #bdece4;
      color: #20303b;
    }

    body.edu-sidebar-page .edu-sidebar__header {
      gap: 8px;
      min-height: 46px;
      margin-bottom: 12px;
    }

    body.edu-sidebar-page .edu-sidebar__toggle {
      flex-basis: 44px;
      width: 44px;
      height: 44px;
      padding: 0;
    }

    body.edu-sidebar-page .edu-sidebar__toggle img {
      width: 42px;
      height: 42px;
    }

    body.edu-sidebar-page .edu-sidebar__title {
      color: #27364a;
    }

    body.edu-sidebar-page .edu-sidebar__link {
      min-height: 44px;
      margin: 3px 0;
      padding: 10px 12px;
      border-radius: 14px;
      background: transparent;
      color: #17252e;
      box-shadow: none;
    }

    body.edu-sidebar-page .edu-sidebar__link::before {
      display: none;
    }

    body.edu-sidebar-page .edu-sidebar__link:hover {
      transform: none;
      background: rgba(255,255,255,0.52);
      box-shadow: none;
    }

    body.edu-sidebar-page .edu-sidebar__link:active,
    body.edu-sidebar-page .edu-sidebar__link[aria-current="page"] {
      transform: none;
      background: #fff;
      box-shadow: none;
    }

    body.edu-sidebar-page .edu-sidebar__quarter-link {
      min-height: 40px;
      margin: 2px 0;
      padding: 8px 12px;
    }

    body.edu-index-page.dashboard-active .dashboard::before {
      background-image: url("student-list-decoration.svg");
      background-position: right 6% top 8%;
      background-repeat: no-repeat;
      background-size: min(600px, 55vw) auto;
      opacity: 0.18;
    }

    body.edu-index-page.dashboard-active .main h1 {
      color: #263342;
      text-shadow: none;
    }

    body.edu-index-page:not(.dashboard-active) {
      background-color: #fff1df !important;
      background-image:
        linear-gradient(rgba(255,244,232,0.7),rgba(255,244,232,0.7)),
        url("bg.jpg") !important;
      background-size: cover, cover !important;
      background-position: center, center !important;
      background-repeat: no-repeat !important;
      background-attachment: fixed !important;
    }

    body.edu-index-page:not(.dashboard-active) #login::before {
      content: none;
    }

    body.edu-index-page:not(.dashboard-active) .form-box,
    body.edu-index-page .modal-content {
      border: 1px solid rgba(255,255,255,0.8);
      border-radius: 22px;
      background: rgba(255,255,255,0.88);
      box-shadow: 0 6px 22px rgba(91,74,55,0.12);
      color: #263342;
    }

    body.edu-index-page:not(.dashboard-active) .form-box h2 {
      color: #35485a;
    }

    body.edu-index-page:not(.dashboard-active) .form-box input {
      border-color: #b6d2d6;
      border-radius: 14px;
    }

    body.edu-index-page:not(.dashboard-active) .form-box button,
    body.edu-index-page .student-btn {
      border-radius: 14px;
      background: linear-gradient(#69e65b,#28bd36);
      box-shadow: 0 4px 0 #16852b,0 6px 12px rgba(33,130,52,0.18);
    }

    body.edu-index-page:not(.dashboard-active) .form-box button:nth-of-type(2) {
      background: #bfe7f5;
      color: #263342;
      box-shadow: 0 3px 0 #91c9d8;
    }

    body.edu-index-page:not(.dashboard-active) .form-box button:nth-of-type(3) {
      background: #f7c9c8;
      color: #263342;
      box-shadow: 0 3px 0 #dfa7a7;
    }

    @media (max-width: 768px) {
      body.edu-site-theme,
      body.edu-index-page.dashboard-active,
      body.edu-index-page:not(.dashboard-active) {
        background-size: cover, cover !important;
        background-position: center, center !important;
      }

      body.edu-site-theme .container,
      body.edu-site-theme .content {
        border-radius: 18px;
      }
    }

    @media (max-width: 900px) and (orientation: landscape) and (max-height: 450px) {
      body.edu-sidebar-page.edu-week-menu-page > .container {
        padding: 10px 16px;
      }

      body.edu-sidebar-page.edu-week-menu-page .cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(12px, 2vw, 18px);
      }

      body.edu-sidebar-page.edu-week-menu-page .cards > .card {
        box-sizing: border-box;
        width: 100%;
        min-width: 0;
        min-height: 200px;
        padding: 18px 12px;
        font-size: clamp(18px, 3.2vw, 23px);
        line-height: 1.15;
        overflow-wrap: break-word;
      }

      body.edu-sidebar-page.edu-week-menu-page .cards > .card .card-icon {
        width: clamp(42px, 8vh, 52px);
        height: clamp(42px, 8vh, 52px);
        object-fit: contain;
      }

      body.edu-sidebar-page.edu-quarter-page .weeks .week {
        grid-template-columns: clamp(52px, 8vw, 64px) minmax(0, 1fr);
        gap: clamp(8px, 1.4vw, 12px);
        font-size: clamp(22px, 6vh, 26px);
      }

      body.edu-sidebar-page.edu-quarter-page .week-lesson-gif {
        width: clamp(48px, 7vw, 58px);
        height: clamp(38px, 10vh, 46px);
      }

      body.edu-sidebar-page .edu-sidebar__title {
        font-size: 20px;
        font-weight: 800;
      }

      body.edu-sidebar-page .edu-sidebar .edu-sidebar__link {
        height: 36px !important;
        min-height: 36px !important;
        margin: 2px 0 !important;
        padding: 4px 8px;
        gap: 8px;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.1;
      }

      body.edu-sidebar-page .edu-sidebar__icon {
        flex-basis: 22px;
        width: 22px;
        height: 22px;
        font-size: 22px;
      }
    }

  `;
  document.head.appendChild(style);

  const alertStyle = document.createElement("style");
  alertStyle.textContent = `
    .edu-alert-overlay {
      position: fixed;
      inset: 0;
      z-index: 20000;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(10, 20, 30, 0.62);
    }

    .edu-alert-overlay[hidden] {
      display: none;
    }

    .edu-alert-dialog {
      width: min(420px, 100%);
      padding: 26px;
      border: 3px dashed #986b32;
      border-radius: 20px;
      background: linear-gradient(145deg, #fffdf4, #f2dfb4);
      color: #514126;
      font: 16px/1.6 Arial, sans-serif;
      box-shadow: 0 8px 0 #c5a66c, 0 16px 28px rgba(0, 0, 0, 0.3);
    }

    .edu-alert-dialog h2 {
      margin: 0 0 12px;
      color: #76511e;
      font-size: 22px;
    }

    .edu-alert-dialog p {
      margin: 0;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .edu-alert-dialog button {
      display: block;
      width: 100%;
      margin-top: 22px;
      padding: 12px 18px;
      border: 0;
      border-radius: 12px;
      background: linear-gradient(to bottom, #4b6cb7, #34495e);
      color: #fff;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 5px 0 #22313f;
    }

    .edu-alert-dialog button:focus-visible {
      outline: 3px solid #f1c40f;
      outline-offset: 3px;
    }
  `;
  document.head.appendChild(alertStyle);

  const alertOverlay = document.createElement("div");
  alertOverlay.className = "edu-alert-overlay";
  alertOverlay.hidden = true;
  alertOverlay.innerHTML = `
    <section class="edu-alert-dialog" role="alertdialog" aria-modal="true" aria-labelledby="eduAlertTitle" aria-describedby="eduAlertMessage">
      <h2 id="eduAlertTitle">EduBoost</h2>
      <p id="eduAlertMessage"></p>
      <button type="button">OK</button>
    </section>
  `;
  document.body.appendChild(alertOverlay);

  const alertMessage = alertOverlay.querySelector("#eduAlertMessage");
  const alertButton = alertOverlay.querySelector("button");
  const alertQueue = [];
  let alertIsOpen = false;
  let alertReturnFocus = null;
  let activeAlert = null;

  function showNextAlert(){
    if(alertIsOpen || alertQueue.length === 0) return;
    alertIsOpen = true;
    alertReturnFocus = document.activeElement;
    activeAlert = alertQueue.shift();
    alertMessage.textContent = activeAlert.message;
    alertOverlay.hidden = false;
    alertButton.focus();
  }

  function closeAppAlert(){
    if(!alertIsOpen) return;
    alertIsOpen = false;
    alertOverlay.hidden = true;
    activeAlert.resolve();
    activeAlert = null;
    if(alertReturnFocus instanceof HTMLElement && alertReturnFocus.isConnected){
      alertReturnFocus.focus();
    }
    alertReturnFocus = null;
    showNextAlert();
  }

  alertButton.addEventListener("click", closeAppAlert);
  alertOverlay.addEventListener("keydown", event => {
    if(event.key === "Escape" || event.key === "Enter"){
      event.preventDefault();
      closeAppAlert();
    }else if(event.key === "Tab"){
      event.preventDefault();
      alertButton.focus();
    }
  });
  window.showAppAlert = message => new Promise(resolve => {
    alertQueue.push({message: String(message), resolve});
    showNextAlert();
  });
  window.alert = message => {
    window.showAppAlert(message);
  };

  const sidebar = document.createElement("aside");
  sidebar.className = "edu-sidebar";
  sidebar.setAttribute("aria-label", "Main navigation");
  sidebar.innerHTML = `
    <div class="edu-sidebar__header">
      <button class="edu-sidebar__toggle" type="button" aria-expanded="true" aria-label="Collapse sidebar" title="Collapse sidebar"><img src="owl.png" alt=""></button>
      <a class="edu-sidebar__title" href="index.html" aria-label="EduBoost home">Eduboost</a>
    </div>
    <nav class="edu-sidebar__nav">
      <details class="edu-sidebar__quarters">
        <summary class="edu-sidebar__link edu-sidebar__quarter-toggle" title="Quarters">
          <span class="edu-sidebar__icon" aria-hidden="true">📚</span>
          <span class="edu-sidebar__label">Quarters</span>
          <span class="edu-sidebar__quarter-chevron" aria-hidden="true">⌄</span>
        </summary>
        <div class="edu-sidebar__quarter-options">
          <a class="edu-sidebar__link edu-sidebar__quarter-link" href="quarter1.html" title="Quarter 1"><span class="edu-sidebar__icon" aria-hidden="true">📘</span><span class="edu-sidebar__label">Quarter 1</span></a>
          <a class="edu-sidebar__link edu-sidebar__quarter-link" href="quarter2.html" title="Quarter 2"><span class="edu-sidebar__icon" aria-hidden="true">📗</span><span class="edu-sidebar__label">Quarter 2</span></a>
          <a class="edu-sidebar__link edu-sidebar__quarter-link" href="quarter3.html" title="Quarter 3"><span class="edu-sidebar__icon" aria-hidden="true">📙</span><span class="edu-sidebar__label">Quarter 3</span></a>
          <a class="edu-sidebar__link edu-sidebar__quarter-link" href="quarter4.html" title="Quarter 4"><span class="edu-sidebar__icon" aria-hidden="true">📕</span><span class="edu-sidebar__label">Quarter 4</span></a>
        </div>
      </details>
      <a class="edu-sidebar__link edu-sidebar__teacher-only" href="studentlist.html" title="Student List"><img class="edu-sidebar__icon" src="student.png" alt=""><span class="edu-sidebar__label">Student List</span></a>
      <a class="edu-sidebar__link" href="leaderboard.html" title="Leaderboard"><img class="edu-sidebar__icon" src="leaderboard.png" alt=""><span class="edu-sidebar__label">Leaderboard</span></a>
      <a class="edu-sidebar__link" href="shortvowels.html" title="Short Vowels"><img class="edu-sidebar__icon" src="vowel.png" alt=""><span class="edu-sidebar__label">Short Vowels</span></a>
      <a class="edu-sidebar__link edu-sidebar__teacher-only" href="bulletinboard.html" title="Bulletin Board"><img class="edu-sidebar__icon" src="bulletin-board.png" alt=""><span class="edu-sidebar__label">Bulletin Board</span></a>
      <a class="edu-sidebar__link" href="index.html" data-action="logout" title="Logout" aria-label="Logout"><span class="edu-sidebar__icon" aria-hidden="true">🚪</span><span class="edu-sidebar__label">Logout</span></a>
    </nav>
  `;

  const clickSound = new Audio("button-sound-effect.mp3");
  clickSound.preload = "auto";

  function playSidebarEffects(target) {
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(error => {
      console.error("Sidebar sound effect could not be played:", error);
    });

    const rect = target.getBoundingClientRect();
    for (let i = 0; i < 35; i++) {
      const particle = document.createElement("div");
      particle.className = "edu-sidebar-firework";
      particle.textContent = "✨";
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.color = `hsl(${Math.random() * 360},100%,60%)`;
      particle.style.fontSize = `${18 + Math.random() * 14}px`;
      const angle = Math.random() * 360;
      const distance = 80 + Math.random() * 140;
      particle.style.setProperty("--x", `${Math.cos(angle * Math.PI / 180) * distance}px`);
      particle.style.setProperty("--y", `${Math.sin(angle * Math.PI / 180) * distance}px`);
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }

  const fireworkStyle = document.createElement("style");
  fireworkStyle.textContent = `
    .edu-sidebar-firework {
      position: fixed;
      width: 20px;
      height: 20px;
      pointer-events: none;
      z-index: 10001;
      animation: eduSidebarExplode 0.8s ease-out forwards;
    }

    @keyframes eduSidebarExplode {
      0% { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(var(--x),var(--y)) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(fireworkStyle);

  const toggle = sidebar.querySelector(".edu-sidebar__toggle");
  const quarters = sidebar.querySelector(".edu-sidebar__quarters");
  const quarterToggle = sidebar.querySelector(".edu-sidebar__quarter-toggle");
  const currentPath = location.pathname.split("/").pop().toLowerCase();
  if (/^quarter[1-4]week[1-8]_las\.html$/.test(currentPath)) {
    document.body.classList.add("edu-las-page");
  }
  if (currentPath === "bulletinboard.html") {
    document.body.classList.add("edu-bulletin-page");
  }
  if (/^quarter[1-4]week[1-8]\.html$/.test(currentPath)) {
    document.body.classList.add("edu-week-menu-page");
  }
  if (currentPath === "index.html" || currentPath === "") {
    document.body.classList.add("edu-index-page");
  } else {
    document.body.classList.add("edu-site-theme");
  }
  if (currentPath === "studentlist.html") {
    document.body.classList.add("edu-student-list-page");
  }
  quarters.open = currentPath === "studentlist.html";
  quarterToggle.setAttribute("aria-expanded", String(quarters.open));
  quarters.addEventListener("toggle", () => {
    quarterToggle.setAttribute("aria-expanded", String(quarters.open));
  });
  quarterToggle.addEventListener("click", () => {
    playSidebarEffects(quarterToggle);
  });
  const compactViewport = window.matchMedia("(max-width: 900px)").matches;
  const collapsed = compactViewport || localStorage.getItem("eduSidebarCollapsed") === "true";
  sidebar.classList.toggle("edu-sidebar--collapsed", collapsed);
  document.body.classList.add("edu-sidebar-page");
  if (document.querySelector(".tabs") && document.querySelector(".lesson")) {
    document.body.classList.add("edu-lesson-page");
  }
  const quarterMatch = location.pathname.match(/quarter([1-4])\.html$/i);
  if (quarterMatch && document.querySelector(".weeks")) {
    document.body.classList.add("edu-quarter-page");
    document.querySelectorAll(".weeks .week").forEach((week, index) => {
      const weekNumber = index + 1;
      const image = document.createElement("img");
      image.className = "week-lesson-gif";
      image.src = `lesson-gifs/quarter-${quarterMatch[1]}-week-${weekNumber}.gif`;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.className = "week-label";
      label.textContent = week.textContent.trim();
      week.replaceChildren(image, label);
    });
  }
  if (document.querySelector(".speak-btn")) {
    document.body.classList.add("edu-le-page");
    if (typeof window.startKaraoke === "function" && !window.startKaraoke.eduKaraokeReady) {
      const startKaraoke = window.startKaraoke;
      const startHighlighting = (audio, id) => {
        startKaraoke(audio, id);
        const words = [...(document.getElementById(id)?.querySelectorAll("span") || [])]
          .filter(word => word.textContent.trim());
        if (!words.length || !Number.isFinite(audio.duration) || audio.duration <= 0) return;

        const syllableCount = word => {
          const letters = word.toLowerCase().replace(/[^a-z]/g, "");
          const vowelGroups = letters.match(/[aeiouy]+/g) || [];
          let count = vowelGroups.length;
          if (letters.length > 2 && /e$/.test(letters) && !/[^aeiouy]le$/.test(letters)) {
            count--;
          }
          return Math.max(1, count);
        };
        const weights = words.map((word, index) => {
          const token = word.textContent.trim();
          let weight = syllableCount(token);
          if (index < words.length - 1) {
            if (/[.!?]$/.test(token)) weight += 0.8;
            else if (/[;:]$/.test(token)) weight += 0.55;
            else if (/,$/.test(token)) weight += 0.35;
          }
          return weight;
        });
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const starts = [];
        let elapsedWeight = 0;
        for (const weight of weights) {
          starts.push(elapsedWeight / totalWeight * audio.duration);
          elapsedWeight += weight;
        }

        const updateHighlight = () => {
          let currentIndex = -1;
          for (let index = 0; index < starts.length; index++) {
            if (audio.currentTime < starts[index]) break;
            currentIndex = index;
          }
          words.forEach((word, index) => {
            word.classList.toggle("done", index < currentIndex);
            word.classList.toggle("active", index === currentIndex);
          });
        };
        audio.ontimeupdate = updateHighlight;
        audio.onended = () => {
          words.forEach(word => word.classList.remove("active", "done"));
        };
        updateHighlight();
      };
      startHighlighting.eduKaraokeReady = true;
      window.startKaraoke = startHighlighting;
    }
    if (typeof window.playAudio === "function" && !window.playAudio.eduKaraokeReady) {
      const playAudio = window.playAudio;
      const startHighlighting = (file, id) => {
        const paragraph = document.getElementById(id);
        const words = paragraph?.querySelectorAll("span");
        if (words?.length) {
          words.forEach(word => word.classList.remove("active", "done"));
          words[0].classList.add("active");
        }
        return playAudio(file, id);
      };
      startHighlighting.eduKaraokeReady = true;
      window.playAudio = startHighlighting;
    }
  }
  if (document.body.classList.contains("edu-las-page")) {
    const isStudentLoggedIn = () => localStorage.getItem("studentLoggedIn") === "true";
    let teacherAuthPromise;
    let pendingRewardPrefix = null;
    let scoreRequestPending = false;

    const getTeacherUser = () => {
      if (isStudentLoggedIn()) return Promise.resolve(null);
      if (!teacherAuthPromise) {
        teacherAuthPromise = Promise.all([
          import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
        ]).then(([firebaseApp, firebaseAuth]) => {
          const firebaseConfig = {
            apiKey: "AIzaSyD46KkaPIAZEfermrLeTs14LBaWLr_M_8s",
            authDomain: "readingapp-c4818.firebaseapp.com",
            databaseURL: "https://readingapp-c4818-default-rtdb.firebaseio.com",
            projectId: "readingapp-c4818",
            storageBucket: "readingapp-c4818.firebasestorage.app",
            messagingSenderId: "746466165470",
            appId: "1:746466165470:web:32ad5c4b973e8afe01b84f"
          };
          const app = firebaseApp.getApps().find(item => item.name === "[DEFAULT]")
            || firebaseApp.initializeApp(firebaseConfig);
          const auth = firebaseAuth.getAuth(app);
          return new Promise((resolve, reject) => {
            let unsubscribe = () => {};
            unsubscribe = firebaseAuth.onAuthStateChanged(
              auth,
              user => {
                unsubscribe();
                resolve(user);
              },
              error => {
                unsubscribe();
                reject(error);
              }
            );
          });
        });
      }
      return teacherAuthPromise;
    };

    const getStudentByName = async name => {
      if (!window.firebase?.apps?.length) {
        throw new Error("The student database is not available.");
      }
      const snapshot = await window.firebase.database().ref("students").once("value");
      const matches = [];
      snapshot.forEach(child => {
        if (child.val()?.name === name) matches.push({ id: child.key, name });
      });
      if (matches.length !== 1) {
        throw new Error(matches.length
          ? `More than one student record matches ${name}.`
          : `No student record was found for ${name}.`);
      }
      return matches[0];
    };

    const awardPoints = async (studentId, studentName, rewardPrefix = null) => {
      const rewardKey = rewardPrefix
        ? `${rewardPrefix}${encodeURIComponent(studentId)}`
        : null;
      if (rewardKey && localStorage.getItem(rewardKey) === "true") {
        alert(`Points for ${studentName} were already awarded.`);
        return false;
      }
      if (!window.firebase?.apps?.length) {
        throw new Error("The student database is not available.");
      }
      const result = await window.firebase.database()
        .ref(`students/${studentId}/score`)
        .transaction(score => (Number(score) || 0) + 10);
      if (!result.committed) throw new Error("The points could not be saved.");
      if (rewardKey) localStorage.setItem(rewardKey, "true");
      alert(`✅ 10 points awarded to ${studentName}.`);
      return true;
    };

    window.eduIsTeacherLoggedIn = async () => Boolean(await getTeacherUser());
    window.eduAwardCurrentStudentOnce = async rewardPrefix => {
      if (!isStudentLoggedIn()) {
        throw new Error("Sign in as a student to receive these points.");
      }
      const studentName = localStorage.getItem("studentName");
      if (!studentName) throw new Error("The signed-in student name is missing.");
      const student = await getStudentByName(studentName);
      return awardPoints(student.id, student.name, rewardPrefix);
    };
    window.eduOpenStudentPicker = async rewardPrefix => {
      return window.openModal(rewardPrefix);
    };

    window.openModal = async rewardPrefix => {
      if (scoreRequestPending) return;
      scoreRequestPending = true;
      try {
        if (isStudentLoggedIn()) {
          pendingRewardPrefix = null;
          const studentName = localStorage.getItem("studentName");
          if (!studentName) throw new Error("The signed-in student name is missing.");
          const student = await getStudentByName(studentName);
          await awardPoints(student.id, student.name);
          return;
        }
        if (!await window.eduIsTeacherLoggedIn()) {
          alert("Please sign in as a teacher to award points.");
          return;
        }
        pendingRewardPrefix = rewardPrefix || null;
        const modal = document.getElementById("modal");
        if (!modal) throw new Error("The student selection dialog is unavailable.");
        modal.style.display = "flex";
      } catch (error) {
        console.error("Unable to open the LAS student reward flow:", error);
        alert(error.message || "Unable to award points. Please try again.");
      } finally {
        scoreRequestPending = false;
      }
    };

    window.givePoints = async studentId => {
      if (scoreRequestPending) return;
      scoreRequestPending = true;
      try {
        const teacher = await window.eduIsTeacherLoggedIn();
        if (!teacher) throw new Error("Only a signed-in teacher can select a student.");
        if (!window.firebase?.apps?.length) {
          throw new Error("The student database is not available.");
        }
        const snapshot = await window.firebase.database().ref(`students/${studentId}`).once("value");
        const studentName = snapshot.val()?.name;
        if (!studentName) throw new Error("The selected student record is unavailable.");
        const awarded = await awardPoints(studentId, studentName, pendingRewardPrefix);
        if (awarded) {
          pendingRewardPrefix = null;
          window.closeModal?.();
        }
      } catch (error) {
        console.error("Unable to save LAS points:", error);
        alert(error.message || "Points could not be saved. Please try again.");
      } finally {
        scoreRequestPending = false;
      }
    };

    if (isStudentLoggedIn()) {
      document.querySelectorAll(".score-btn").forEach(button => {
        button.style.display = "none";
      });
    }
  }
  document.documentElement.classList.add("edu-sidebar-page");
  document.body.classList.toggle("edu-sidebar-page--collapsed", collapsed);
  toggle.setAttribute("aria-expanded", String(!collapsed));
  toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  toggle.title = collapsed ? "Expand sidebar" : "Collapse sidebar";

  const compactViewportQuery = window.matchMedia("(max-width: 900px)");
  compactViewportQuery.addEventListener("change", event => {
    if (!event.matches) return;
    sidebar.classList.add("edu-sidebar--collapsed");
    document.body.classList.add("edu-sidebar-page--collapsed");
    localStorage.setItem("eduSidebarCollapsed", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Expand sidebar");
    toggle.title = "Expand sidebar";
  });

  toggle.addEventListener("click", () => {
    playSidebarEffects(toggle);
    const isCollapsed = sidebar.classList.toggle("edu-sidebar--collapsed");
    document.body.classList.toggle("edu-sidebar-page--collapsed", isCollapsed);
    localStorage.setItem("eduSidebarCollapsed", String(isCollapsed));
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
    toggle.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
    toggle.title = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
  });

  sidebar.querySelectorAll("a.edu-sidebar__link").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      playSidebarEffects(link);

      if (link.dataset.action === "logout") {
        localStorage.removeItem("studentLoggedIn");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentGender");

        const firebaseConfig = {
          apiKey: "AIzaSyD46KkaPIAZEfermrLeTs14LBaWLr_M_8s",
          authDomain: "readingapp-c4818.firebaseapp.com",
          databaseURL: "https://readingapp-c4818-default-rtdb.firebaseio.com",
          projectId: "readingapp-c4818",
          storageBucket: "readingapp-c4818.firebasestorage.app",
          messagingSenderId: "746466165470",
          appId: "1:746466165470:web:32ad5c4b973e8afe01b84f"
        };

        Promise.all([
          import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
        ]).then(([firebaseApp, firebaseAuth]) => {
          const app = firebaseApp.getApps().length
            ? firebaseApp.getApp()
            : firebaseApp.initializeApp(firebaseConfig);
          return firebaseAuth.signOut(firebaseAuth.getAuth(app));
        }).then(() => {
          setTimeout(() => {
            window.location.href = "index.html";
          }, 800);
        }).catch(error => {
          console.error("Logout failed:", error);
          alert("Unable to log out. Please try again.");
        });
        return;
      }

      window.eduFadeBackgroundMusic?.();
      setTimeout(() => {
        window.location.href = link.href;
      }, 800);
    });
  });

  if (localStorage.getItem("studentLoggedIn") === "true") {
    sidebar.querySelectorAll(".edu-sidebar__teacher-only").forEach(link => {
      link.hidden = true;
    });
  }

  const lasHeaderMatch = currentPath.match(/^quarter([1-4])week([1-8])_las\.html$/);
  if (lasHeaderMatch) {
    const headerTitle = document.querySelector(".header h2");
    if (headerTitle) {
      headerTitle.textContent = `Quarter ${lasHeaderMatch[1]} Week ${lasHeaderMatch[2]} - Learning Activity Sheet`;
    }
  }

  sidebar.querySelectorAll("a.edu-sidebar__link").forEach(link => {
    if (link.getAttribute("href").toLowerCase() === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  const lasPageMatch = location.pathname.match(/quarter([1-4])week([1-8])_las\.html$/i);
  document.body.appendChild(sidebar);

  if (lasPageMatch && typeof window.confirmAnswer === "function") {
    const confirmAnswer = window.confirmAnswer;
    window.confirmAnswer = function (...args) {
      const button = typeof pendingButton === "undefined" ? null : pendingButton;
      const activeContainer = button?.closest(".part:not(.hidden), .day:not(.hidden)");
      const result = confirmAnswer.apply(this, args);
      if (!button || !activeContainer) return result;

      const lessons = Array.from(activeContainer.querySelectorAll(".lesson"));
      const lessonIndex = lessons.findIndex(lesson => lesson.contains(button));
      const current = lessons[lessonIndex];
      if (!current || lessons.length < 2) return result;

      window.setTimeout(() => {
        if (!current.isConnected || !current.classList.contains("active")) return;
        current.classList.add("edu-swipe-out-next");
        window.setTimeout(() => {
          if (typeof window.showLesson !== "function") {
            current.classList.remove("edu-swipe-out-next");
            return;
          }
          window.showLesson(lessonIndex + 1);
          const next = activeContainer.querySelector(".lesson.active");
          next?.classList.add("edu-swipe-in-next");
          window.setTimeout(() => {
            current.classList.remove("edu-swipe-out-next");
            next?.classList.remove("edu-swipe-in-next");
          }, 300);
        }, 100);
      }, 450);

      return result;
    };
  }

  if (
    lasPageMatch &&
    !(lasPageMatch[1] === "1" && lasPageMatch[2] === "1") &&
    document.querySelector(".tabs") &&
    document.querySelector(".part") &&
    !document.getElementById("part5")
  ) {
    const dayFiveScript = document.createElement("script");
    dayFiveScript.src = "las-day5.js?v=20261028-day5-student-picker";
    dayFiveScript.onerror = () => {
      console.error(`Unable to load the Day 5 activity for ${location.pathname}.`);
    };
    document.body.appendChild(dayFiveScript);
  }

  if (document.querySelector(".nav-buttons")) {
    document.querySelectorAll(".nav-buttons button").forEach(button => {
      button.setAttribute("aria-hidden", "true");
      button.tabIndex = -1;
    });

    let pointerStart = null;
    let swipeInProgress = false;

    document.addEventListener("pointerdown", event => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen" && event.pointerType !== "mouse") return;
      if (event.target.closest(".edu-sidebar")) return;
      if (event.target.closest("button, a, input, select, textarea, [role='button']")) return;
      if (event.target.closest("#day5, .game-container, [data-day5-game]")) return;

      const lesson = event.target.closest(".lesson.active");
      if (!lesson) return;

      if (event.pointerType === "mouse") {
        if (event.button !== 0) return;
        lesson.classList.add("edu-swipe-dragging");
      }

      pointerStart = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        lesson,
        pointerType: event.pointerType
      };
    });

    document.addEventListener("pointerup", event => {
      if (!pointerStart || event.pointerId !== pointerStart.id) return;

      const start = pointerStart;
      pointerStart = null;
      start.lesson.classList.remove("edu-swipe-dragging");

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
      if (swipeInProgress || !start.lesson.isConnected || !start.lesson.classList.contains("active")) return;

      const direction = deltaX < 0 ? "next" : "previous";
      const selector = direction === "next"
        ? '.nav-buttons button[onclick*="nextLesson"]'
        : '.nav-buttons button[onclick*="prevLesson"]';
      const currentContainer = start.lesson.closest(".day:not(.hidden), .part:not(.hidden)");
      if (currentContainer?.matches("[data-swipe-between-parts]")) {
        const parts = Array.from(document.querySelectorAll(".part"));
        const currentIndex = parts.indexOf(currentContainer);
        const targetPart = parts[currentIndex + (direction === "next" ? 1 : -1)];
        const tabs = Array.from(document.querySelectorAll(".tabs button"));
        const targetTab = tabs[currentIndex + (direction === "next" ? 1 : -1)];
        if (!targetPart || !targetTab) return;

        swipeInProgress = true;
        start.lesson.classList.add(`edu-swipe-out-${direction}`);
        setTimeout(() => {
          targetTab.click();
          setTimeout(() => {
            const activeLesson = targetPart.querySelector(".lesson.active");
            activeLesson?.classList.add(`edu-swipe-in-${direction}`);
            setTimeout(() => {
              document.querySelectorAll(
                ".lesson.edu-swipe-out-next, .lesson.edu-swipe-out-previous, .lesson.edu-swipe-in-next, .lesson.edu-swipe-in-previous"
              ).forEach(lesson => {
                lesson.classList.remove(
                  "edu-swipe-out-next",
                  "edu-swipe-out-previous",
                  "edu-swipe-in-next",
                  "edu-swipe-in-previous"
                );
              });
              swipeInProgress = false;
            }, 300);
          }, 180);
        }, 100);
        return;
      }

      const scopedButtons = currentContainer
        ? Array.from(currentContainer.querySelectorAll(selector))
        : [];
      const navButtons = scopedButtons.length
        ? scopedButtons
        : Array.from(document.querySelectorAll(selector));
      const navButton = navButtons[0];
      if (!navButton) return;

      swipeInProgress = true;
      start.lesson.classList.add(`edu-swipe-out-${direction}`);

      setTimeout(() => {
        const navigateLesson = direction === "next"
          ? window.nextLesson
          : window.prevLesson;
        if (typeof navigateLesson === "function") {
          navigateLesson(navButton);
        } else {
          navButton.click();
        }

        setTimeout(() => {
          const activeLesson = currentContainer
            ? currentContainer.querySelector(".lesson.active")
            : start.lesson.parentElement.querySelector(".lesson.active");
          if (activeLesson && activeLesson !== start.lesson) {
            activeLesson.classList.add(`edu-swipe-in-${direction}`);
          }

          setTimeout(() => {
            document.querySelectorAll(
              ".lesson.edu-swipe-out-next, .lesson.edu-swipe-out-previous, .lesson.edu-swipe-in-next, .lesson.edu-swipe-in-previous"
            ).forEach(lesson => {
              lesson.classList.remove(
                "edu-swipe-out-next",
                "edu-swipe-out-previous",
                "edu-swipe-in-next",
                "edu-swipe-in-previous"
              );
            });
            swipeInProgress = false;
          }, 300);
        }, 180);
      }, 100);
    }, { passive: true });

    document.addEventListener("pointercancel", event => {
      if (pointerStart && event.pointerId === pointerStart.id) {
        pointerStart.lesson.classList.remove("edu-swipe-dragging");
      }
      pointerStart = null;
    }, { passive: true });
  }
})();

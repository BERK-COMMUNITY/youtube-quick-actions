const ACTIONS = {
  notInterested: {
    labels: ['Не интересует', 'Not interested'],
    buttonText: 'Не интересно'
  },
  dontRecommend: {
    labels: ['Не рекомендовать видео с этого канала', "Don't recommend channel"],
    buttonText: 'Не рекомендовать канал'
  }
};

const SELECTORS = {
  videoItems: 'ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer',
  menuButton: '.yt-lockup-metadata-view-model-wiz__menu-button button',
  menuItems: 'tp-yt-iron-dropdown yt-list-item-view-model',
  metaData: 'yt-content-metadata-view-model',
  quickActions: '.quick-actions'
};

class YouTubeQuickActions {

  constructor() {
    this.initializeActions();
    this.observePageChanges();
  }

  initializeActions() {

    this.addQuickActions();

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.addQuickActions(), 100);
    });

  }

  observePageChanges() {

    new MutationObserver(() => {
      setTimeout(() => this.addQuickActions(), 100);
    }).observe(document.body, {
      childList: true,
      subtree: true
    });

  }

  handleAction(menuButton, action) {

    menuButton.click();

    setTimeout(() => {

      const menuItems = document.querySelectorAll(SELECTORS.menuItems);

      for (const label of action.labels) {

        const item = Array.from(menuItems).find(item =>
            item.textContent.includes(label)
        );

        if (item) {
          item.click();
          break;
        }

      }

    }, 100);

  }

  addQuickActions() {

    const videoItems = document.querySelectorAll(SELECTORS.videoItems);

    videoItems.forEach(item => {

      if (item.querySelector(SELECTORS.quickActions)) return;

      const menuButton = item.querySelector(SELECTORS.menuButton);

      if (!menuButton) return;

      const actionsContainer = document.createElement('div');

      actionsContainer.className = 'quick-actions';

      Object.values(ACTIONS).forEach(action => {

        const button = document.createElement('button');

        button.className = 'quick-action-btn';
        button.textContent = action.buttonText;
        button.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleAction(menuButton, action);
        };

        actionsContainer.appendChild(button);

      });

      const metaData = item.querySelector(SELECTORS.metaData);

      if (metaData) {
        metaData.parentNode.insertBefore(actionsContainer, metaData.nextSibling);
      }

    });

  }
  
}

new YouTubeQuickActions();
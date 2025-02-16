const ACTIONS = {
  notInterested: {
    id: 'notInterested',
    labels: ['Не интересует', 'Not interested'],
    buttonText: 'Не интересно'
  },
  dontRecommend: {
    id: 'dontRecommend',
    labels: ['Не рекомендовать видео с этого канала', 'Don\'t recommend channel'],
    buttonText: 'Не рекомендовать канал'
  }
};

class YouTubeQuickActions {

  constructor() {
    this.observePageChanges();
    this.initializeActions();
  }

  initializeActions() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.addQuickActions());
    } else {
      this.addQuickActions();
    }

    // Обработка прокрутки с debounce
    this.setupScrollHandler();
  }

  setupScrollHandler() {

    let scrollTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.addQuickActions(), 100);
    });

  }

  observePageChanges() {

    const observer = new MutationObserver(() => {
      setTimeout(() => this.addQuickActions(), 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

  }

  clickMenuItem(menuItems, action) {

    return action.labels.some(label => {

      const item = Array.from(menuItems).find(item =>
          item.textContent.includes(label)
      );

      if (item) {
        item.click();
        return true;
      }

      return false;
    });

  }

  handleAction(menuButton, actionType) {

    menuButton.click();

    setTimeout(() => {

      const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item');
      const action = ACTIONS[actionType];

      if (action) {
        this.clickMenuItem(menuItems, action);
      }

    }, 150);

  }

  createActionButton(action, menuButton) {

    const button = document.createElement('button');

    button.className = 'quick-action-btn';
    button.textContent = action.buttonText;
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleAction(menuButton, action.id);
    };

    return button;
  }

  addQuickActions() {

    const videoItems = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer');

    videoItems.forEach(item => {

      if (item.querySelector('.quick-actions')) return;

      const menuButton = item.querySelector('#menu button[aria-label]');

      if (!menuButton) return;

      const actionsContainer = document.createElement('div');

      actionsContainer.className = 'quick-actions';

      // Создаем кнопки для каждого действия
      Object.values(ACTIONS).forEach(action => {
        const actionButton = this.createActionButton(action, menuButton);
        actionsContainer.appendChild(actionButton);
      });

      const metaData = item.querySelector('#metadata-line');

      if (metaData) {
        metaData.parentNode.insertBefore(actionsContainer, metaData.nextSibling);
      }

    });

  }

}

new YouTubeQuickActions();
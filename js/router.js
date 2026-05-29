// ==================== 路由控制 ====================

// 页面路由管理
function initRouter() {
  // 监听 hash 变化
  window.addEventListener('hashchange', handleRouteChange);
  
  // 页面加载时处理初始路由
  handleRouteChange();
}

function handleRouteChange() {
  const hash = location.hash.slice(1) || 'home';
  
  // 隐藏所有页面
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });
  
  // 显示目标页面
  const targetPage = document.getElementById(`page-${hash}`);
  if (targetPage) {
    targetPage.style.display = 'block';
    
    // 如果是详情页，加载保存的数据
    if (hash === 'detail') {
      loadFormData();
    }
  } else {
    // 默认显示首页
    document.getElementById('page-home').style.display = 'block';
  }
  
  // 滚动到顶部
  window.scrollTo(0, 0);
}

// 显示加载失败页面
function showLoading() {
  location.hash = 'loading';
}

// Toast 提示
function showToast(message, duration = 2000) {
  // 移除已存在的 toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 创建新的 toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // 自动移除
  setTimeout(() => {
    toast.remove();
  }, duration);
}

// 初始化路由
document.addEventListener('DOMContentLoaded', initRouter);

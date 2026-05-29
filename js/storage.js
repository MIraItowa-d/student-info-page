// ==================== 数据存储管理 ====================

const STORAGE_KEY = 'studentInfo';

// 获取默认数据
function getDefaultData() {
  return {
    // 基础信息
    name: '杨婷婷',
    gender: '女',
    birthDate: '2001-03-11',
    
    // 学校信息
    schoolName: '华中科技大学',
    educationLevel: '本科',
    major: '网络与空间安全',
    studyForm: '普通全日制',
    
    // 详细信息
    nation: '汉族',
    idNumber: '50022520010311002X',
    studyDuration: '4',
    educationType: '普通高等教育',
    college: '网络空间安全学院',
    department: '网络空间安全学院',
    className: '网安学院本2201班',
    studentId: 'U202262182',
    admissionDate: '2022-09-01',
    
    // 照片（Base64）
    admissionPhoto: '',
    diplomaPhoto: ''
  };
}

// 保存数据到 localStorage
function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('保存数据失败:', e);
    return false;
  }
}

// 从 localStorage 加载数据
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('加载数据失败:', e);
  }
  return getDefaultData();
}

// 清空数据
function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

// 压缩图片（Base64）
function compressImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image();
      
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 计算缩放比例
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转为 Base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== 表单逻辑管理 ====================

// 点击计数器
let clickCount = 0;
let clickTimer = null;

// 初始化表单功能
function initForm() {
  // 加载保存的数据
  loadFormData();
  
  // 绑定照片上传事件
  initPhotoUpload();
  
  // 绑定学籍状态连续点击事件
  initStatusClick();
}

// 初始化学籍状态连续点击
function initStatusClick() {
  const statusRow = document.getElementById('status-row');
  if (statusRow) {
    statusRow.addEventListener('click', function() {
      clickCount++;
      
      // 清除之前的计时器
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
      
      // 如果达到3次点击，打开编辑模态框
      if (clickCount >= 3) {
        clickCount = 0;
        openEditModal();
      } else {
        // 设置1.5秒后重置计数
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 1500);
      }
    });
  }
}

// 加载表单数据
function loadFormData() {
  const data = loadFromStorage();
  
  // 显示数据
  updateDisplay(data);
}

// 更新显示内容
function updateDisplay(data) {
  // 基础信息
  setText('display-name', data.name);
  setText('display-gender', data.gender);
  setText('display-birth', formatDate(data.birthDate));
  
  // 学校信息
  setText('display-school', data.schoolName);
  setText('display-level', data.educationLevel);
  setText('display-major', data.major);
  setText('display-form', data.studyForm);
  
  // 详细信息
  setText('display-nation', data.nation);
  setText('display-id', data.idNumber);
  setText('display-duration', data.studyDuration + '年');
  setText('display-type', data.educationType);
  setText('display-college', data.college);
  setText('display-dept', data.department);
  setText('display-class', data.className);
  setText('display-student-id', data.studentId);
  setText('display-admission-date', formatDate(data.admissionDate));
  
  // 加载照片
  if (data.admissionPhoto) {
    setImage('admission-photo-img', data.admissionPhoto);
  }
  if (data.diplomaPhoto) {
    setImage('diploma-photo-img', data.diplomaPhoto);
  }
}

// 格式化日期 (2001-03-11 -> 2001年03月11日)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[0]}年${parts[1]}月${parts[2]}日`;
  }
  return dateStr;
}

// 打开编辑模态框
function openEditModal() {
  const data = loadFromStorage();
  
  // 填充编辑表单
  setValue('edit-name', data.name);
  setValue('edit-gender', data.gender);
  setValue('edit-birth', data.birthDate);
  setValue('edit-school', data.schoolName);
  setValue('edit-level', data.educationLevel);
  setValue('edit-major', data.major);
  setValue('edit-form', data.studyForm);
  setValue('edit-nation', data.nation);
  setValue('edit-id', data.idNumber);
  setValue('edit-duration', data.studyDuration);
  setValue('edit-type', data.educationType);
  setValue('edit-college', data.college);
  setValue('edit-dept', data.department);
  setValue('edit-class', data.className);
  setValue('edit-student-id', data.studentId);
  setValue('edit-admission-date', data.admissionDate);
  
  // 显示模态框
  document.getElementById('edit-modal').style.display = 'flex';
}

// 关闭编辑模态框
function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

// 保存编辑的数据
function saveEditedData() {
  // 验证身份证号
  const idNumber = getValue('edit-id');
  if (!validateIdNumber(idNumber)) {
    showToast('身份证号码格式不正确');
    return;
  }
  
  const data = {
    // 基础信息
    name: getValue('edit-name'),
    gender: getValue('edit-gender'),
    birthDate: getValue('edit-birth'),
    
    // 学校信息
    schoolName: getValue('edit-school'),
    educationLevel: getValue('edit-level'),
    major: getValue('edit-major'),
    studyForm: getValue('edit-form'),
    
    // 详细信息
    nation: getValue('edit-nation'),
    idNumber: getValue('edit-id'),
    studyDuration: getValue('edit-duration'),
    educationType: getValue('edit-type'),
    college: getValue('edit-college'),
    department: getValue('edit-dept'),
    className: getValue('edit-class'),
    studentId: getValue('edit-student-id'),
    admissionDate: getValue('edit-admission-date'),
    
    // 照片
    admissionPhoto: getImage('admission-photo-img'),
    diplomaPhoto: getImage('diploma-photo-img')
  };
  
  if (saveToStorage(data)) {
    updateDisplay(data);
    closeEditModal();
    showToast('保存成功！');
  } else {
    showToast('保存失败，请重试');
  }
}

// 初始化照片上传
function initPhotoUpload() {
  // 录取照片
  const admissionInput = document.getElementById('upload-admission-photo');
  const admissionImg = document.getElementById('admission-photo-img');
  
  if (admissionInput && admissionImg) {
    admissionInput.addEventListener('change', async function(e) {
      await handlePhotoUpload(e, 'admission-photo-img');
    });
    
    // 点击图片也能触发上传
    admissionImg.addEventListener('click', function() {
      admissionInput.click();
    });
  }
  
  // 学历照片
  const diplomaInput = document.getElementById('upload-diploma-photo');
  const diplomaImg = document.getElementById('diploma-photo-img');
  
  if (diplomaInput && diplomaImg) {
    diplomaInput.addEventListener('change', async function(e) {
      await handlePhotoUpload(e, 'diploma-photo-img');
    });
    
    // 点击图片也能触发上传
    diplomaImg.addEventListener('click', function() {
      diplomaInput.click();
    });
  }
}

// 处理照片上传
async function handlePhotoUpload(event, imgId) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  // 检查文件类型
  if (!file.type.match('image.*')) {
    showToast('请上传图片文件');
    return;
  }
  
  // 检查文件大小（限制5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过5MB');
    return;
  }
  
  try {
    // 压缩图片
    const compressedBase64 = await compressImage(file, 800, 0.8);
    
    // 显示预览
    setImage(imgId, compressedBase64);
    
    // 立即保存到存储
    const data = loadFromStorage();
    if (imgId === 'admission-photo-img') {
      data.admissionPhoto = compressedBase64;
    } else {
      data.diplomaPhoto = compressedBase64;
    }
    saveToStorage(data);
    
    showToast('照片上传成功');
  } catch (error) {
    console.error('图片处理失败:', error);
    showToast('照片上传失败，请重试');
  }
}

// ==================== 工具函数 ====================

// 获取元素值
function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value : '';
}

// 设置元素值
function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

// 获取元素文本
function getText(id) {
  const element = document.getElementById(id);
  return element ? element.textContent : '';
}

// 设置元素文本
function setText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

// 获取图片 src
function getImage(id) {
  const element = document.getElementById(id);
  return element ? element.src : '';
}

// 设置图片 src
function setImage(id, src) {
  const element = document.getElementById(id);
  if (element) {
    element.src = src;
  }
}

// 验证身份证号码
function validateIdNumber(idNumber) {
  // 简单验证：18位，最后一位可以是X
  const pattern = /^[1-9]\d{16}[\dXx]$/;
  return pattern.test(idNumber);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 延迟初始化，确保路由先执行
  setTimeout(initForm, 100);
});

// 点击模态框背景关闭
document.addEventListener('click', function(e) {
  const modal = document.getElementById('edit-modal');
  if (e.target === modal) {
    closeEditModal();
  }
});


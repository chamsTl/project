document.addEventListener('DOMContentLoaded', () => {
  const menuButtons = document.querySelectorAll('.menu button');
  const dashboard = document.getElementById('dashboard-section');
  const notifications = document.getElementById('notification-section');
  const users = document.getElementById('users-section');
  const settings = document.getElementById('settings-section'); // إضافة Settings
  const addAdminModal = document.getElementById('add-admin-modal');
  // زر التنقل وتفعيل الأزرار
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const text = button.textContent.trim();

      if (text === 'Dashboard') {
        if (addAdminModal) {
          addAdminModal.style.display = 'none';
        }
        showSection('dashboard-section');
      } else if (text === 'Notification') {
        showSection('notification-section');
        if (addAdminModal) {
          addAdminModal.style.display = 'none';
        }
      } else if (text === 'Users') {
        showSection('users-section');
        if (addAdminModal) {
          addAdminModal.style.display = 'none';
        }
      } else if (text === 'Settings') {  // إضافة شرط للإعدادات
        showSection('settings-section');
        loadProfileSettings();
        if (addAdminModal) {
          addAdminModal.style.display = 'none';
        }
      } else {
        showSection('dashboard-section'); 
        if (addAdminModal) {
          addAdminModal.style.display = 'none';
        }// fallback
      }
    });
  });
  function showSection(sectionId) {
    const sections = ['dashboard-section', 'notification-section', 'users-section', 'settings-section'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = (id === sectionId) ? 'block' : 'none';
      }
    });
  }

  // عرض الـ Dashboard افتراضيًا
  showSection("dashboard-section");
    // Gestion du bouton ajouter admin modal
// Function to toggle the visibility of the Add Admin form/modal
window.toggleAddAdminForm = function () {
  const modal = document.getElementById('add-admin-modal');
  modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
};
  // بحث المستخدمين بالاسم
  const searchInput = document.getElementById('searchUserInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const input = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll('#userTableBody tr');

      rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        if (name.includes(input)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
  // ======= بيانات المستخدمين حسب الأيام =======
  const userByDay = JSON.parse(document.getElementById('user_by_day_data').textContent);
  const labels = Object.keys(userByDay);
  const data = Object.values(userByDay);

  const ctxBar = document.getElementById('weeklyChart').getContext('2d');
  new Chart(ctxBar, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'New Users',
              data: data,
              backgroundColor: ['#007bff', '#dcdcdc', '#007bff'],
              borderColor: ['#0056b3', '#cfcfcf', '#0056b3'],
              borderWidth: 4,
              borderRadius: 5
          }]
      },
      options: {
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom'
            }
          }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  stepSize: 1
              }
          }
      }
  });

  const accepted = parseFloat(document.getElementById('accepted_percentage').textContent);
  const pending = parseFloat(document.getElementById('pending_percentage').textContent);
  
  const ctxDoughnut = document.getElementById('workforceChart').getContext('2d');
  new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
          labels: ['Acceptés', 'En attente'],
          datasets: [{
              data: [accepted, pending],
              backgroundColor: ['#007bff', '#dcdcdc'],
              borderColor: ['#0056b3', '#cfcfcf'],
              borderWidth: [16, 3],
              cutout: '50%' // Donut chart style
          }]
      },
      options: {
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 15,
                padding: 15
              }

            }
            },
              tooltip: {
                  callbacks: {
                      label: function (context) {
                          return `${context.label}: ${context.parsed}%`;
                      }
                  }
              }
          }
      }
  });

  window.onload = function() {
    const messageBox = document.getElementById('django-message');
    
    if (messageBox) {
      const type = messageBox.getAttribute('data-type');
      const text = messageBox.getAttribute('data-text');
  
      showAlert(type, text);
      // Cacher automatiquement après affichage
      messageBox.remove();
    }
  };
  
  function showAlert(type, message) {
    const alertBox = document.createElement('div');
    alertBox.className = `custom-alert ${type}`;
    alertBox.innerText = message;
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.right = '20px';
    alertBox.style.backgroundColor = (type === 'success') ? '#4caf50' : '#f44336';
    alertBox.style.color = 'white';
    alertBox.style.padding = '10px 20px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.boxShadow = '0px 2px 10px rgba(0,0,0,0.2)';
    alertBox.style.zIndex = '9999';
  
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  }
  




  // ✅ وظيفة البحث حسب الاسم الأخير للمستخدمين المقبولين
  window.searchUsersByLastName = function () {
    const input = document.getElementById("searchUserInput").value.toLowerCase().trim();
    const rows = document.querySelectorAll("#userTableBody tr");

    rows.forEach(row => {
      const statutCell = row.querySelector("td:nth-child(7)");
      const lastNameCell = row.querySelector("td:nth-child(2)");

      if (!statutCell || !lastNameCell) return;

      const isAccepted = statutCell.textContent.includes("Accepted");
      const lastName = lastNameCell.textContent.toLowerCase();

      if (isAccepted && lastName.includes(input)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  };
  window.searchByName = function () {
    const input = document.getElementById("searchInput").value.toLowerCase().trim(); // تحويل الإدخال إلى أحرف صغيرة
    const rows = document.querySelectorAll("#user-table-body tr"); // اختيار كل صف في الجدول
  
    rows.forEach(row => {
      const lastNameCell = row.querySelector("td:nth-child(1)"); // اختيار الخلية الأولى التي تحتوي على "Last Name"
      if (!lastNameCell) return;
  
      const lastName = lastNameCell.textContent.toLowerCase(); // جلب قيمة "Last Name" وتحويلها إلى أحرف صغيرة
      if (lastName.includes(input)) {
        row.style.display = ""; // إظهار الصف إذا كان الاسم يحتوي على النص المدخل
      } else {
        row.style.display = "none"; // إخفاء الصف إذا لم يكن الاسم يحتوي على النص المدخل
      }
    });
  };
 
 
  function closeEditPopup() {
    document.querySelectorAll('.popup').forEach(popup => {
      popup.style.display = 'none';
    });
  }
  
});


//update profile setting 
function getCSRFToken() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") return decodeURIComponent(value);
  }
  return "";
}

function loadProfileSettings() {
  const profileForm = document.getElementById("profileForm");

  if (!profileForm) {
    console.log("❌ لم يتم العثور على النموذج");
    return;
  }

  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {
      const response = await fetch("/profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
          fullName,
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.success);
        window.location.reload();
      } else {
        alert(data.error || "حدث خطأ غير معروف");
      }
    } catch (error) {
      console.error("خطأ في الجانب العميل:", error);
      alert("🚨 حدث خطأ أثناء التحديث، حاول مرة أخرى.");
    }
  });
  
}
 



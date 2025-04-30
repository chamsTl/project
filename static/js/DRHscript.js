// --- تحديد العناصر ---
const menuButtons = document.querySelectorAll('.menu button');
const mainContent = document.querySelector('.main');
const modal = document.getElementById('promotion-modal');

const pages = {
  "Dashboard": `
  <h1>Welcome Back</h1>
  <p>Here is the information about all the center details</p>
<div class="summary">
<div class="card">
<h2 id="employes-count">0</h2>
<p>Employees</p>
<span>&#8593; Today</span>
</div>
<div class="card">
   <h2 id="candidats-count">0</h2>
   <p>Candidates</p>
     <span>&#8593; Today</span>
</div>
<div class="card">
  <h2 id="absences-count">0</h2>
  <p>Absences</p>
    <span>&#8593; Today</span>
</div>
</div>
<div class="chart-container">
<div class="chart">
  <h3>Weekly Overview</h3>

  <canvas id="departementChart"></canvas>
</div>
<div class="workforce">
  <h3>Workforce</h3>
  <canvas id="workforceChart"></canvas>
</div>
</div>
  `,
 "Recruitment": `
 <!-- صفحة Recruitment -->
<div class="recruitment-body">
  <h1>Available Jobs</h1>
  <!-- مربع البحث -->
  <div class="search-wrapper">
    <input type="text" id="recruitmentSearchInput" placeholder="Search by job title..." />
    <button id="recruitmentSearchBtn">🔍 Search</button>
  </div>
  <!-- زر إضافة وظيفة -->
  <div class="add-job-container">
    <button id="addJobBtn" class="add-job-button">
      ➕ Add Job
    </button>
  </div>
  <!-- جدول الوظائف -->
    <table class="employee-table recruitment-table">
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Creation Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="Recruitment-body">
        <!-- Jobs data will be dynamically inserted here -->
      </tbody>
    </table>
</div>
`,
"Performance Evaluations": `
<div class="evaluation-container">
  <h2>Performance Evaluations</h2>
  <div class="search-wrapper">
    <div>
      <input type="text" id="evaluationSearchInput" placeholder="Search by employee name..." />
      <button id="evaluationSearchBtn">🔍 Search</button>
      <input type="hidden" id="csrf-token" value="{{ csrf_token }}">
    </div>
    <button id="addEvaluationBtn" class="btn btn-success">➕ Add Evaluation</button>
  </div>

  <!-- Modal Add Evaluation -->
  <div id="addEvaluationModal" class="modal">
    <h3>Add New Evaluation</h3>
    <form id="addEvaluationForm">
      <!-- 🎯 القائمة المنسدلة للموظفين -->
      <label for="contractEmployeeSelect">Employee:</label>
<select id="contractEmployeeSelect" name="employe" required></select>

      <label for="evaluationDateInput">Evaluation Date:</label>
      <input type="date" id="evaluationDateInput" name="date" required>

      <label for="ratingInput">Rating:</label>
      <select id="ratingInput" name="note" required>
        <option value="1">1 - Poor</option>
        <option value="2">2 - Fair</option>
        <option value="3">3 - Good</option>
        <option value="4">4 - Very Good</option>
        <option value="5">5 - Excellent</option>
      </select>

      <label for="commentInput">Comment:</label>
      <textarea id="commentInput" name="comment" rows="3" required></textarea>

      <label for="categoryInput">Category:</label>
      <select id="categoryInput" name="category" required>
        <option value="performance">Performance</option>
        <option value="leadership">Leadership</option>
        <option value="communication">Communication</option>
        <option value="teamwork">Teamwork</option>
      </select>

      <div class="modal-buttons">
        <button type="submit" class="btn btn-primary">💾 Save</button>
        <button type="button" id="cancelEvaluationModalBtn" class="btn btn-secondary">❌ Cancel</button>
      </div>
    </form>
  </div>

  <div id="evaluation-message-box" style="display:none;"></div>

  <table class="employee-table">
    <thead>
      <tr>
        <th>Employee</th>
        <th>Evaluation Date</th>
        <th>Rating</th>
        <th>Comment</th>
        <th>Category</th>
        <th>Added By</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="evaluation-body"></tbody>
  </table>
</div>

`,
"Contract Management": `
  <div class="contract-container">
    <h2>Contracts</h2>
    <div class="search-wrapper">
      <div>
        <input type="text" id="contractSearchInput" placeholder="Search by employee name..." />
        <button id="contractSearchBtn">Search</button>
<input type="hidden" id="csrf-token" value="{{ csrf_token }}">
      </div>
      <button id="addContractBtn" class="btn btn-success">Add Contract</button>
    </div>

    <!-- Modal Add Contract -->
<div id="addContractModal" class="modal">
  <h3>Add New Contract</h3>
  <form id="addContractForm">
    <label for="contractEmployeeSelect">Employee:</label>
<select id="contractEmployeeSelect" name="employe" required></select>
    <label for="typeInput">Contract Type:</label>
    <input type="text" id="typeInput" required>

    <label for="startDateInput">Start Date:</label>
    <input type="date" id="startDateInput" required>

    <label for="endDateInput">End Date:</label>
    <input type="date" id="endDateInput">

    <label for="salaryInput">Salary:</label>
    <input type="number" id="salaryInput" required>

    <label for="statusInput">Status:</label>
    <input type="text" id="statusInput" value="en cours">

    <label for="documentInput">Upload Contract (PDF):</label>
    <input type="file" id="documentInput" accept="application/pdf">

    <div class="modal-buttons">
      <button type="submit" class="btn btn-primary">Save</button>
      <button type="button" id="cancelModalBtn" class="btn btn-secondary">Cancel</button>
    </div>
  </form>
</div>

    <div id="message-box" style="display:none;"></div>

    <table class="employee-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Type</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Salary</th>
          <th>Status</th>
          <th>Document</th>
          <th>Near End?</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="contract-body">
        <!-- Dynamic rows will be added here -->
      </tbody>
    </table>
  </div>
`
,
"Profile Settings": `
    <h1>Profile Settings</h1>
    <p>Edit your personal information.</p>
    <form id="profileForm">
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required />
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter new password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required />
      </div>
      <div class="form-group button-wrapper">
        <button class="button-update" type="submit">Update Profile</button>
      </div>
    </form>
  `,
"Leave Management": `
<div id="conges-section" >
<h1>Leave Management</h1>

<div class="search-wrapper">
  <input type="text" id="searchInput" placeholder="Search by name..." />
  <button id="searchBtn">🔍 Search</button>
</div>

<table class="leave-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Start</th>
      <th>End</th>
      <th>Reason</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody id="leave-body">
    <!-- Data rows will be dynamically inserted here -->
  </tbody>
</table>
</div>
`
,
"Payroll Management": `
<div id="payroll-section">
  <h1>Payroll Management</h1>
 <div class="search-wrapper">
  <input type="text" id="payroll-search" placeholder="Search by employee name..." />
  <button id="payroll-search-btn">🔍 Search</button>
</div>
<button id="mark-paid" class ="mark-paid">Mark as Paid</button>

  <table class="payroll-table">
    <thead>
      <tr>
    <th><input type="checkbox" id="select-all"></th>
    <th>Name</th>
    <th>Month</th>
    <th>Gross</th>
    <th>Deductions</th>
    <th>Net</th>
    <th>Status</th>
    <th>Actions</th>
      </tr>
    </thead>
    
    <tbody id="payroll-body">
      <!-- Payroll rows will be loaded here -->
    </tbody>
  </table>
</div>
`
,
"Employee Management": `
  <h1>Employee Management</h1>
<div class="search-wrapper">
  <input type="text" id="employeeSearchInput" placeholder="Search by employee name..." />
  <button id="employeeSearchBtn">🔍 Search</button>
</div>

<table class="employee-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Position</th>
      <th>Department</th>
      <th>Hire Date</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody id="employee-body">
    <!-- Employee data will be dynamically inserted here -->
  </tbody>
</table>
  `,
  "Promotion Modal": `
    <div id="promotion-modal" style="display: none;">
      <div class="modal-content">
        <h2>Promotion</h2>
        <label for="promotion-type">New Position:</label>
        <input type="text" id="promotion-type" placeholder="Enter new position">
        <button id="accept-promotion">Accept</button>
        <button id="cancel-promotion">Cancel</button>
      </div>
    </div>
  `,
  "Transfer Modal": `
  <div id="transfer-modal" style="display: none;">
    <div class="modal-content">
      <h2>Transfer</h2>
      <label for="new-department">New Department:</label>
      <input type="text" id="new-department" placeholder="Enter new department">
      <label for="new-post">New Position:</label>
      <input type="text" id="new-post" placeholder="Enter new position">
      <button id="accept-transfer">Accept</button>
      <button id="cancel-transfer">Cancel</button>
    </div>
  </div>
`
,
};

// تفعيل الأحداث بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () { 
  const mainDiv = document.querySelector(".main");

  if (!mainDiv) {
    console.error("❌ عنصر main مش موجود في الصفحة!");
    return;
  }

  mainDiv.innerHTML = pages["Dashboard"];

  // تأخير تنفيذ loadEmployeeOptions للتأكد من أن الصفحة قد تم تحميلها
  setTimeout(() => {
    setupEvaluationModalEvents()
  }, 100); // التأخير 100 ملي ثانية كافي!

});
function addTransferModal() {
  // تحقق إذا كان المودال موجودًا بالفعل في الـ DOM
  if (!document.getElementById('transfer-modal')) {
    // إضافة المودال ديناميكيًا باستخدام الكود من الكائن pages
    const modalHTML = pages["Transfer Modal"];
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}
function showTransferModal(employeeId) {
  // إضافة المودال إذا لم يكن موجودًا
  addTransferModal();

  console.log("Showing transfer modal for employee ID:", employeeId);

  // العثور على المودال وإظهاره
  const modal = document.getElementById('transfer-modal');
  if (!modal) {
    console.error("Transfer modal not found!");
    return;
  }

  // إظهار المودال
  setTimeout(function() {
    modal.style.display = 'flex';  // إظهار الـ modal
  }, 50);

  // إعداد الوظائف للـ Accept و Cancel
  document.getElementById('accept-transfer').onclick = function() {
    const newDept = document.getElementById('new-department').value;
    const newPost = document.getElementById('new-post').value;
    if (newDept.trim() === '' || newPost.trim() === '') {
      alert('Please enter both department and position!');
      return;
    }
    transferEmployee(employeeId, newDept, newPost);
    modal.style.display = 'none';
  };

  document.getElementById('cancel-transfer').onclick = function() {
    modal.style.display = 'none';
  };
}

// --- تحميل بيانات الموظفين ---
function loadEmployeeData() {
  fetch('/api/employees/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données des employés');
      }
      return response.json();
    })
    .then(data => {
      renderEmployeeTable(data);
    });
}

// --- عرض جدول الموظفين ---
function renderEmployeeTable(data) {
  const tbody = document.getElementById("employee-body");
  if (!tbody) return;

  tbody.innerHTML = ""; // تنظيف الجدول قبل الإضافة
  console.log("👨‍👩‍👧‍👦 Rendering employee table with data:", data);

  data.forEach(emp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.position}</td>
      <td>${emp.department}</td>
      <td>${emp.hireDate}</td>
      <td>
        <span class="status ${emp.status.toLowerCase()}">${emp.status}</span>
      </td>
      <td>
        <button class="promote" data-id="${emp.id}">Promote</button>
        <button class="transfer" data-id="${emp.id}">Transfer</button> <!-- إضافة data-id هنا -->
      </td>
    `;
    tbody.appendChild(row);
  });

  // --- ربط أحداث الأزرار ---
  document.querySelectorAll('.promote').forEach(button => {
    button.addEventListener('click', function() {
      const employeeId = this.getAttribute('data-id');
      showPromotionModal(employeeId);
    });
  });

  document.querySelectorAll('.transfer').forEach(button => {
    button.addEventListener('click', function() {
      const employeeId = this.getAttribute('data-id'); // استخدام data-id هنا مباشرة
      showTransferModal(employeeId); // تمرير ID الموظف
    });
  });
 
}

// --- عرض جدول العقود ---
function renderContractTable(contracts) {
  const tbody = document.getElementById('contract-body');
  tbody.innerHTML = '';

  contracts.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${c.employee || 'N/A'}</td>
      <td>${c.type || 'N/A'}</td>
      <td>${c.startDate || 'N/A'}</td>
      <td>${c.endDate || 'N/A'}</td>
      <td>${c.salary ? `${c.salary} TND` : 'N/A'}</td>
      <td><span class="status">${c.status || 'N/A'}</span></td>
      <td>${c.document ? `<a href="${c.document}" target="_blank">📄 Télécharger</a>` : '🚫 No document'}</td>
      <td>${c.isNearEnd ? '⏳ Yes' : '✅ No'}</td>
      <td>
        <button class="update btn btn-primary" data-id="${c.id}">Update</button>
        <button class="delete btn btn-danger" data-id="${c.id}">Delete</button>
      </td>
    `;

    row.querySelector('.update').addEventListener('click', function () {
      const contractId = this.getAttribute('data-id');
      updateContract(contractId);
    });

    row.querySelector('.delete').addEventListener('click', function () {
      const contractId = this.getAttribute('data-id');
      deleteContract(contractId);
    });

    tbody.appendChild(row);
  });
}


function renderRecruitmentJobs(jobs) {
  const tbody = document.getElementById("Recruitment-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  jobs.forEach(job => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", job.id);
    row.innerHTML = `
      <td>${job.title}</td>
      <td>${job.description}</td>
      <td>${job.status}</td>
      <td>${job.creationDate}</td>
      <td>
        <button class="update" data-id="${job.id}">Update</button>
        <button class="delete" data-id="${job.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}


function setupContractModalEvents() {
  const addBtn = document.getElementById("addContractBtn");
  const modal = document.getElementById("addContractModal");
  const cancelBtn = document.getElementById("cancelModalBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  
  if (addBtn && modal) {
    addBtn.addEventListener("click", () => {
      modal.style.display = "block";
      loadEmployeeOptions();

      const addContractForm = document.getElementById("addContractForm");

      if (addContractForm) {
        addContractForm.addEventListener("submit", function (e) {
          e.preventDefault(); // 🚫 ما نخلّي الصفحة تعفس!

          const today = new Date().toISOString().split("T")[0];
          const startDate = document.getElementById("startDateInput").value;
          const endDate = document.getElementById("endDateInput").value;

          if (startDate < today) {
            alert("❌ لا يمكن اختيار تاريخ بداية قبل تاريخ اليوم!");
            return;
          }

          if (endDate && endDate < startDate) {
            alert("❌ تاريخ نهاية العقد لا يمكن أن يكون قبل البداية!");
            return;
          }

          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

          if (endDate && diffInMonths < 1) {
            alert("❌ مدة العقد يجب أن تكون شهراً واحداً على الأقل!");
            return;
          }

          const formData = new FormData();
          formData.append("employe", document.getElementById("contractEmployeeSelect").value);
          formData.append("type_contrat", document.getElementById("typeInput").value);
          formData.append("date_debut", startDate);
          formData.append("date_fin", endDate);
          formData.append("salaire", document.getElementById("salaryInput").value);
          formData.append("statut_contrat", document.getElementById("statusInput").value);

          const fileInput = document.getElementById("documentInput");
          if (fileInput.files.length > 0) {
            formData.append("document", fileInput.files[0]);
          }

          // 🧪 Debug log
          for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }

          fetch("/api/contracts/create/", {
            method: "POST",
            headers: {
              "X-CSRFToken": getCSRFToken()
            },
            body: formData,
            credentials: "include"
          })
          .then(response => {
            if (!response.ok) throw new Error("فشل الإرسال");
            return response.json();
          })
          .then(data => {
            alert("✅ تم إنشاء العقد!");
            modal.style.display = "none";

            const tbody = document.getElementById("contract-body");
            const row = document.createElement("tr");

            const employeeName = document.getElementById("contractEmployeeSelect").selectedOptions[0].text;
            const type = document.getElementById("typeInput").value;
            const startDate = document.getElementById("startDateInput").value;
            const endDate = document.getElementById("endDateInput").value || 'N/A';
            const salary = document.getElementById("salaryInput").value;
            const status = document.getElementById("statusInput").value;

            row.innerHTML = `
              <td>${employeeName}</td>
              <td>${type}</td>
              <td>${startDate}</td>
              <td>${endDate}</td>
              <td>${salary} TND</td>
              <td><span class="status">${status}</span></td>
              <td>${data.document ? `<a href="${data.document}" target="_blank">📄 Télécharger</a>` : '🚫 No document'}</td>
              <td>${data.isNearEnd ? '⏳ Yes' : '✅ No'}</td>
              <td>
                <button class="update btn btn-primary">Update</button>
                <button class="delete btn btn-danger">Delete</button>
              </td>
            `;

            // ربط الأزرار الرهيبة
            row.querySelector(".update").addEventListener("click", function () {
              updateContract(data.id);
            });

            row.querySelector(".delete").addEventListener("click", function () {
              deleteContract(data.id);
            });

            tbody.appendChild(row);
          })
          .catch(error => {
            console.error("😵‍💫 خطأ:", error);
            alert("فشل إنشاء العقد، راجع المعلومات.");
          });

        }, { once: true });
      } else {
        console.warn("❗لم يتم العثور على النموذج!");
      }
    });
  }
}

// --- تحميل بيانات العقود مع فلترة حسب اسم الموظف ---
function loadContractData(filter = "") {
  fetch('/api/contracts/', { credentials: 'include' })
    .then(response => response.json())
    .then(contracts => {
      console.log("✅ البيانات المسترجعة للعقود:", contracts);

      const tbody = document.getElementById("contract-body");
      tbody.innerHTML = "";

      const filteredContracts = contracts.filter(c =>
        c.employee.toLowerCase().includes(filter.toLowerCase())
      );

      if (filteredContracts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">😢 لا توجد نتائج</td></tr>';
      } else {
        renderContractTable(filteredContracts);
      }
    })
    .catch(error => {
      console.error('Error loading contracts:', error);
    });
}

let currentPage = "";

function showPage(pageName) {
  if (currentPage === pageName) return; // ما نحمّلوش نفس الصفحة مرتين
  currentPage = pageName;

  const container = document.getElementById("mainContent");
  container.innerHTML = pages[pageName];

  switch (pageName) {
    case "Dashboard":
    loadDashboardData();
    renderCharts();

      break;
    // ✨ أضف باقي الصفحات إذا تحب...
  }
}

// --- حذف عقد ---
function deleteContract(id) {
  if (!id) {
    alert("❌ المعرف غير صحيح!");
    return;
  }

  if (confirm("هل أنت متأكد أنك تريد حذف هذا العقد؟")) {
    showMessage("🔄 جاري حذف العقد...", "info");

    fetch(`/api/contracts/${id}/`, {
      method: 'DELETE',
      headers: { 'X-CSRFToken': getCSRFToken() },
      credentials: 'include'
    })
    .then(response => {
      if (response.ok) {
        showMessage("✅ تم حذف العقد بنجاح!", "success");
        loadContractData(); // تحديث الجدول
      } else {
        showMessage("❌ فشل في حذف العقد", "error");
      }
    })
    .catch(error => {
      console.error('Error deleting contract:', error);
      showMessage("❌ حدث خطأ أثناء الحذف", "error");
    });
  }
}

function updateContract(id) {
  if (!id) {
    alert("❌ المعرف غير صحيح!");
    return;
  }

  const newSalary = prompt("💰 أدخل الراتب الجديد:");
  const newStartDate = prompt("📅 أدخل تاريخ بداية العقد (YYYY-MM-DD):");
  const newEndDate = prompt("📅 أدخل تاريخ نهاية العقد (أو اتركه فارغاً):");
  const newStatus = prompt("⚙️ أدخل الحالة الجديدة (مثلاً: en cours, terminé, suspendu):");

  if (!newSalary && !newStartDate && !newEndDate && !newStatus) {
    showMessage("⚠️ لم يتم إدخال أي تغييرات!", "warning");
    return;
  }

  // نجمع البيانات المُحدثة
  const updatedData = {};
  if (newSalary) updatedData.salary = newSalary;
  if (newStartDate) updatedData.startDate = newStartDate;
  updatedData.endDate = newEndDate || ""; // لو تركها المستخدم فارغة، نرسلها كـ ""
  if (newStatus) updatedData.status = newStatus;

  showMessage("🔄 جاري تحديث العقد...", "info");

  fetch(`/api/contracts/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify(updatedData),
    credentials: 'include'
  })
  .then(response => {
    if (response.ok) {
      showMessage("✅ تم تحديث العقد بنجاح!", "success");
      loadContractData(); // تحديث الجدول
    } else {
      response.json().then(data => {
        showMessage(`❌ فشل التحديث: ${data.message || 'حدث خطأ غير متوقع'}`, "error");
      });
    }
  })
  .catch(error => {
    console.error('Error updating contract:', error);
    showMessage("❌ حدث خطأ أثناء التحديث", "error");
  });
}


function showMessage(message, type = "success") {
  const messageBox = document.getElementById("message-box");
  if (messageBox) {
    messageBox.textContent = message;
    messageBox.style.display = "block";
    messageBox.style.color = type === "success" ? "green" : type === "error" ? "red" : "blue";
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  }
}


// إظهار الـ modal عند الضغط على "Promote"
function addPromotionModal() {
  // تحقق إذا كان المودال موجودًا بالفعل في DOM
  if (!document.getElementById('promotion-modal')) {
    // إضافة المودال ديناميكيًا باستخدام الكود من الكائن pages
    const modalHTML = pages["Promotion Modal"];
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

function showPromotionModal(employeeId) {
  // إضافة المودال إذا لم يكن موجودًا
  addPromotionModal();

  console.log("Showing promotion modal for employee ID:", employeeId);

  // العثور على المودال وإظهاره
  const modal = document.getElementById('promotion-modal');
  if (!modal) {
    console.error("Modal not found!");
    return;
  }

  // إظهار المودال
  setTimeout(function() {
    modal.style.display = 'flex';  // إظهار الـ modal
  }, 50);

  // إعداد الوظائف للـ Accept و Cancel
  document.getElementById('accept-promotion').onclick = function() {
    const promotionType = document.getElementById('promotion-type').value;
    if (promotionType.trim() === '') {
      alert('Please enter a valid promotion type.');
      return;
    }
    promoteEmployee(employeeId, promotionType);
    modal.style.display = 'none';
  };

  document.getElementById('cancel-promotion').onclick = function() {
    modal.style.display = 'none';
  };
}

// Function to promote an employee
function promoteEmployee(employeeId, newPoste) {
  // الحصول على CSRF Token من العنصر <meta> في HTML
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
  fetch(`/api/employees/${employeeId}/promote/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken  // إضافة CSRF Token إلى الرأس
      },
      body: JSON.stringify({
          newPoste: newPoste
      })
  })
  .then(response => {
      if (!response.ok) throw new Error("Promotion failed!");
      return response.json();
  })
  .then(data => {
      alert('Employee promoted successfully!');
  })
  .catch(err => {
      console.error(err);
      alert('Error promoting employee.');
  });
}

function transferEmployee(employeeId, newDepartment, newPost) {
  // الحصول على CSRF Token من العنصر <meta> في HTML
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
  fetch(`/transfer-employee/${employeeId}/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken  // إضافة CSRF Token إلى الرأس
      },
      body: JSON.stringify({
          department: newDepartment,
          post: newPost
      })
  })
  .then(response => {
      if (!response.ok) throw new Error("Transfer failed!");
      return response.json();
  })
  .then(data => {
    alert('Employee transferred successfully!');
    loadEmployeeData(); // 🔄 إعادة تحميل البيانات وتحديث الجدول
})

  .catch(err => {
      console.error(err);
      alert('Error transferring employee.');
  });
}


menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    // إزالة الفئة النشطة من جميع الأزرار
    menuButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // الحصول على اسم الصفحة المحددة
    const selectedPage = button.innerText.trim();

    // تعيين المحتوى بناءً على الصفحة المحددة
    mainContent.innerHTML = pages[selectedPage] || `<h1>${selectedPage}</h1><p>Content coming soon...</p>`;

    // استدعاء الدالة المناسبة بناءً على الصفحة المحددة
    switch (selectedPage) {
      case "Dashboard":
        renderCharts();
        break;
      case "Recruitment":
        loadRecrutementJobs();
        break;
      case "Leave Management":
        loadLeaveRequests(); 
        setupLeaveSearch();
        break;
      case "Employee Management":
        loadEmployeeData();
        break;
      case "Contract Management":
        loadContractData();
        setupContractModalEvents();
        break;        
      case "Performance Evaluations":
        loadPerformanceEvaluations();
        setupEvaluationModalEvents(); // تأكد من أنك تستدعي دالة إعداد الأحداث بعد تحميل المحتوى
        break;
      case "Payroll Management":
        loadPayrollData();
      setupPayrollSearch();
        break;
      case "Profile Settings":
        loadProfileSettings();
        break;
    }
  });
});


function loadRecrutementJobs() {
  fetch('/api/recruitment/')
    .then(response => response.json())
    .then(data => {
      const jobs = data.jobs;
      const tbody = document.getElementById("Recruitment-body");
      if (!tbody) return;

      // 🧹 مسح المحتوى القديم
      tbody.innerHTML = "";

      // 🧾 عرض الوظائف في الجدول
      jobs.forEach(job => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", job.id);

        row.innerHTML = `
          <td>${job.title}</td>
          <td>${job.description}</td>
          <td>${job.status}</td>
          <td>${job.creationDate}</td>
          <td>
            <button class="update" data-id="${job.id}">Update</button>
            <button class="delete" data-id="${job.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      // ✨ زر الإضافة
      const addBtn = document.getElementById("addJobBtn");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const title = prompt("🎯 أدخل عنوان الوظيفة:");
          const description = prompt("📝 أدخل وصف الوظيفة:");
          const status = prompt("📌 أدخل الحالة (مثل: open, closed):");

          if (title && description && status) {
            fetch('/api/recruitment/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
              },
              body: JSON.stringify({
                title: title,
                description: description,
                status: status
              })
              
            })
              .then(response => {
                if (response.ok) return response.json();
                else throw new Error("❌ فشل إنشاء الوظيفة!");
              })
              .then(() => {
                alert("✅ تمت إضافة الوظيفة بنجاح!");
                loadRecrutementJobs();
              })
              .catch(error => {
                console.error("🚨 خطأ في الإضافة:", error);
                alert("❌ حدث خطأ أثناء إضافة الوظيفة!");
              });
          } else {
            alert("⚠️ الرجاء ملء جميع الحقول!");
          }
        });
      }

      // 🔁 تحديث وظيفة
      document.querySelectorAll('.update').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          const newTitle = prompt("📝 العنوان الجديد:");
          const newDesc = prompt("💬 الوصف الجديد:");
          const newStatus = prompt("🔁 الحالة الجديدة:");

          if (newTitle && newDesc && newStatus) {
            fetch(`/api/recruitment/${id}/update/`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
              },
              body: JSON.stringify({
                title: newTitle,
                description: newDesc,
                status: newStatus
              })
            })
              .then(response => {
                if (response.ok) return response.json();
                else throw new Error("❌ حدث خطأ أثناء التحديث");
              })
              .then(() => {
                alert("✅ تم التحديث بنجاح!");
                loadRecrutementJobs();
              })
              .catch(error => {
                console.error("🚨 خطأ في التحديث:", error);
                alert("❌ فشل التحديث!");
              });
          } else {
            alert("⚠️ من فضلك أدخل كل البيانات!");
          }
        });
      });

      // 🗑️ حذف وظيفة
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');

          if (confirm("❗هل أنت متأكد أنك تريد حذف هذه الوظيفة؟")) {
            fetch(`/api/recruitment/${id}/delete/`, {
              method: 'DELETE',
              headers: {
                'X-CSRFToken': getCSRFToken(),
              }
            })
              .then(response => {
                if (response.ok) {
                  alert("✅ تم الحذف بنجاح!");
                  loadRecrutementJobs();
                } else {
                  alert("❌ حدث خطأ أثناء الحذف!");
                }
              })
              .catch(error => {
                console.error("🚨 خطأ في الحذف:", error);
                alert("❌ فشل الحذف!");
              });
          }
        });
      });
    })
    .catch(error => {
      console.error("😵 حدث خطأ أثناء تحميل الوظائف:", error);
    });
}

function loadPerformanceEvaluations() {
  fetch('/evaluations/')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(evaluations => {
      const tbody = document.getElementById("evaluation-body");
      tbody.innerHTML = "";

      evaluations.forEach(evalData => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", evalData.id);  // نحتفظ بمعرف التقييم في الـtr
        row.innerHTML = `
          <td>${evalData.employee}</td>
          <td>${evalData.date}</td>
          <td>${evalData.score}</td>
          <td>${evalData.comment}</td>
          <td>${evalData.category}</td>
          <td>${evalData.user}</td>  <!-- عرض اسم المستخدم الذي أضاف التقييم -->
          <td>
            <button class="update" data-id="${evalData.id}">Update</button>
            <button class="delete" data-id="${evalData.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      // 🧙‍♂️ Liste des updates
      document.querySelectorAll('.update').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');

          const newNote = prompt("Entrez la nouvelle note :");
          const newCommentaire = prompt("Entrez le nouveau commentaire :");
          const newCategory = prompt("Entrez la nouvelle catégorie :");

          if (newNote && newCommentaire && newCategory) {
            fetch(`/evaluations/${id}/update/`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
              },
              body: JSON.stringify({
                note: newNote,
                commentaire: newCommentaire,
                category: newCategory  // إضافة التصنيف الجديد
              })
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Erreur HTTP lors de la mise à jour: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                alert("✅ Mise à jour réussie !");

                // تحديث البيانات في الصفحة مباشرة بدون إعادة تحميل الصفحة
                const updatedRow = document.querySelector(`tr[data-id="${id}"]`);
                updatedRow.querySelector("td:nth-child(3)").textContent = newNote;  // تحديث التقييم
                updatedRow.querySelector("td:nth-child(4)").textContent = newCommentaire;  // تحديث التعليق
                updatedRow.querySelector("td:nth-child(5)").textContent = newCategory;  // تحديث التصنيف
              })
              .catch(error => {
                console.error("Erreur:", error);
                alert(`❌ Échec de la mise à jour: ${error.message}`);
              });
          }
        });
      });

      // 🧼 Liste des suppressions
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');

          if (confirm("Êtes-vous sûr de vouloir supprimer cette évaluation ?")) {
            fetch(`/evaluations/${id}/delete/`, {
              method: 'DELETE',
              headers: {
                'X-CSRFToken': getCSRFToken(),
              }
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Erreur HTTP lors de la suppression: ${response.status}`);
                }
                alert("✅ Évaluation supprimée !");

                // إزالة الصف مباشرة من الجدول
                const rowToDelete = document.querySelector(`tr[data-id="${id}"]`);
                rowToDelete.remove();
              })
              .catch(error => {
                console.error("Erreur:", error);
                alert(`❌ Erreur lors de la suppression: ${error.message}`);
              });
          }
        });
      });
    })
    .catch(error => {
      console.error('Oops! Une erreur est survenue :', error);
      alert(`❌ Une erreur est survenue lors du chargement des évaluations : ${error.message}`);
    });
}

// دالة البحث المعدلة
function searchHandler(searchBtnId, searchInputId, apiUrl, renderTableCallback, highlightClass = 'highlight-search-result') {
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === searchBtnId) {
      const searchInput = document.getElementById(searchInputId);
      const searchValue = searchInput.value.trim().toLowerCase();
      const searchBtn = document.getElementById(searchBtnId);

      console.log(`🔍 تم الضغط على زر البحث!`);
      searchBtn.disabled = true;

      // ✅ تحديد رابط API المناسب (بفلتر أو بدون حسب حالة البحث)
      const finalUrl = searchValue === ''
        ? apiUrl // بدون فلتر لو الحقل فاضي
        : `${apiUrl}?q=${encodeURIComponent(searchValue)}`;

      if (searchValue === '') {
        alert("⚠️ الحقل فارغ! سيتم عرض كل النتائج.");
      }

      fetch(finalUrl)
        .then(response => {
          console.log(`📡 جاري الاتصال بالسيرفر (${finalUrl})...`);
          if (!response.ok) throw new Error("فشل الاتصال");
          return response.json();
        })
        .then(data => {
          console.log("✅ البيانات المستلمة:", data);

          if (data.message) {
            alert(data.message);
            return;
          }

          let filteredData = data;

          // ✅ فلترة فقط لو فيه كلمة بحث
          if (searchValue !== '') {
            filteredData = data.filter(item => {
              if (item.title) {
                return item.title.toLowerCase().includes(searchValue); // لو فيه title (بحث وظائف)
              } else if (item.employee) {
                return item.employee.toLowerCase().includes(searchValue); // تقييمات
              } else if (item.name) {
                return item.name.toLowerCase().includes(searchValue); // موظفين
              } else {
                return false;
              }
            });
          }

          if (filteredData.length === 0) {
            console.log("❌ لم يتم العثور على نتائج مطابقة.");
            alert("❌ لم يتم العثور على نتائج مطابقة.");
            return;
          }

          console.log("✅ نتائج البحث:", filteredData);
          renderTableCallback(filteredData);

          // 🖍️ تمييز النتائج
          const bodyId = searchInputId.includes('recruitment') ? 'Recruitment-body' :
                         searchInputId.includes('evaluation') ? 'evaluation-body' :
                         searchInputId.includes('employee') ? 'employee-body' :
                         searchInputId.includes('contract') ? 'contract-body' :
                         '';

          if (bodyId) {
            const rows = document.querySelectorAll(`#${bodyId} tr`);
            rows.forEach(row => {
              const cell = row.querySelector("td");
              const text = cell ? cell.textContent.trim().toLowerCase() : '';
              if (text.includes(searchValue)) {
                row.querySelectorAll('td').forEach(cell => cell.classList.add(highlightClass));
              } else {
                row.querySelectorAll('td').forEach(cell => cell.classList.remove(highlightClass));
              }
            });
          }
        })
        .catch(err => {
          console.error("💥 خطأ:", err);
          alert("حدث خطأ أثناء البحث.");
        })
        .finally(() => {
          searchBtn.disabled = false;
        });
    }
  });
}

function loadEmployeeOptions() {
  fetch('/api/employees/', { credentials: 'include' })
    .then(response => response.json())
    .then(employees => {
      const select = document.getElementById("contractEmployeeSelect");
      if (!select) {
        console.warn("❗ لم يتم العثور على عنصر select للموظفين");
        return;
      }

      // تفريغ القائمة الحالية
      select.innerHTML = '<option value="">اختر موظفًا</option>';

      employees.forEach(emp => {
        const option = document.createElement("option");
        option.value = emp.id;
        option.textContent = emp.name; // أو emp.full_name حسب هيكلة بياناتك
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("❌ خطأ في تحميل قائمة الموظفين:", error);
    });
}

function setupEvaluationModalEvents() {
  const addEvaluationBtn = document.getElementById("addEvaluationBtn");
  const modal = document.getElementById("addEvaluationModal");
  const cancelBtn = document.getElementById("cancelEvaluationModalBtn");
  const form = document.getElementById("addEvaluationForm");

  function getCSRFToken() {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1];
  }

  const csrfToken = getCSRFToken();

  if (!addEvaluationBtn || !modal || !cancelBtn || !form || !csrfToken) {
    console.error("❌ Missing one or more elements in Evaluation modal setup!");
    return;
  }

  addEvaluationBtn.addEventListener("click", () => {
    modal.style.display = "block";
    loadEmployeeOptions();  // تحميل قائمة الموظفين
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("evaluationDateInput").value;
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      alert("❌ لا يمكن اختيار تاريخ تقييم قبل اليوم!");
      return;
    }

    const employeeSelect = document.getElementById("contractEmployeeSelect");
    const employeeId = employeeSelect.value;
    const employeeName = employeeSelect.selectedOptions[0]?.text || "";

    if (!employeeId) {
      alert("⚠️ يرجى اختيار موظف من القائمة!");
      return;
    }

    const rating = document.getElementById("ratingInput").value.trim();
    const comment = document.getElementById("commentInput").value.trim();
    const category = document.getElementById("categoryInput").value.trim();

    if (!rating || !comment || !category) {
      alert("⚠️ يرجى ملء كافة الحقول!");
      return;
    }

    const evaluationData = {
      employe: employeeId,
      date: date,
      note: rating,
      comment: comment,
      category: category,
    };

    console.log("🚀 إرسال البيانات:", evaluationData);

    fetch("/add_evaluation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(evaluationData),
      credentials: "include",
    })
      .then(response => response.json())  // اجلب JSON من السيرفر
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
    
        alert("✅ تم إضافة التقييم بنجاح!");
    
        // التحديث الديناميكي للجدول بدون انتظار إعادة تحميل الصفحة
        const tbody = document.getElementById("evaluation-body");
        const row = document.createElement("tr");
        const ratingText = ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1];
    
        row.innerHTML = `
          <td>${data.employee_full_name}</td>
          <td>${date}</td>
          <td>${ratingText}</td>
          <td>${comment}</td>
          <td>${data.category}</td>
          <td>${data.added_by}</td> <!-- المستخدم الذي قام بإضافة التقييم -->
          <td>
            <button class="update btn btn-primary">Update</button>
            <button class="delete btn btn-danger">Delete</button>
          </td>
        `;
    
        row.querySelector(".update").addEventListener("click", () => updateEvaluation(data.id));
        row.querySelector(".delete").addEventListener("click", () => deleteEvaluation(data.id));
    
        tbody.appendChild(row);
    
        modal.style.display = "none";
        form.reset();
      })
      .catch(error => {
        console.error("🔥 خطأ أثناء الإرسال:", error);
        alert("❌ فشل في إرسال التقييم. حاول مرة أخرى!");
      });
    });

}

// دالة لعرض البيانات في الجدول
function renderEvaluationTable(data) {
  const tableBody = document.getElementById("evaluation-body");
  tableBody.innerHTML = ''; // مسح البيانات القديمة

  data.forEach(item => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.employee}</td>
      <td>${item.date}</td>
      <td>${item.score}</td>
      <td>${item.comment}</td>
      <td>${item.category || ''}</td>
      <td>${item.added_by || "Unknown"}</td>
      <td>
        <button class="update btn btn-primary">Update</button>
        <button class="delete btn btn-danger">Delete</button>
      </td>
    `;

    // تأكدي إن عندك معرف التقييم item.id
    row.querySelector(".update").addEventListener("click", () => updateEvaluation(item.id));
    row.querySelector(".delete").addEventListener("click", () => deleteEvaluation(item.id));

    tableBody.appendChild(row);
  });
}


// تنفيذ دالة البحث مع البيانات
searchHandler('evaluationSearchBtn', 'evaluationSearchInput', '/evaluations/', renderEvaluationTable);
// تنفيذ دالة البحث للمستخدمين والعقود
searchHandler('employeeSearchBtn', 'employeeSearchInput', '/api/employees/', renderEmployeeTable);
searchHandler('contractSearchBtn', 'contractSearchInput', '/api/contracts/', renderContractTable);
searchHandler('recruitmentSearchBtn', 'recruitmentSearchInput', '/api/recruitment/search/', renderRecruitmentJobs);

//party finich sousou
function loadDashboardData() {
  fetch('/api/dashboard-data/')
    .then(response => response.json())
    .then(data => {
      renderChartsFromData(data);
    })
    .catch(error => {
      console.error("Error loading dashboard data:", error);
    });
}
// Function to load leave requests from the server
function loadLeaveRequests() {
  fetch('/api/conges/')
    .then(response => response.json())
    .then(data => {
      console.log(data); 
      const tbody = document.getElementById("leave-body");
      tbody.innerHTML = ""; // Clear previous content

      data.forEach(request => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", request.id);  // Store request ID in the row for easy access

        row.innerHTML = `
          <td>${request.name}</td>
          <td>${request.start}</td>
          <td>${request.end}</td>
          <td>${request.reason}</td>
          <td class="status1 ${request.status === 'accepté' ? 'paid' : request.status === 'rejeté' ? 'pending' : 'pending'}">${request.status}</td>
          <td>
            <button class="approve" data-id="${request.id}" ${request.status !== 'en attente' ? 'disabled' : ''}>✔</button>
            <button class="reject" data-id="${request.id}" ${request.status !== 'en attente' ? 'disabled' : ''}>✖</button>
          </td>
        `;
        tbody.appendChild(row);
      });

     // Apply filter after loading the data
      addLeaveActionListeners(); // Add action listeners for approve and reject
    })
    .catch(error => console.error("Error loading leave requests:", error));
}

// Function to add event listeners for approve and reject buttons
// Function to add event listeners for approve and reject buttons
function addLeaveActionListeners() {
  document.querySelectorAll('.approve').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      const row = this.closest('tr');
      const approveBtn = row.querySelector('.approve');
      const rejectBtn = row.querySelector('.reject');

      if (approveBtn.disabled || rejectBtn.disabled) return;

      const confirmApprove = confirm("Are you sure you want to accept this leave request?");
      if (confirmApprove) {
        approveBtn.disabled = true;
        rejectBtn.disabled = true;

        updateLeaveStatus(id, 'accepté', row);
      }
    });
  });

  document.querySelectorAll('.reject').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      const row = this.closest('tr');
      const approveBtn = row.querySelector('.approve');
      const rejectBtn = row.querySelector('.reject');

      if (approveBtn.disabled || rejectBtn.disabled) return;

      const confirmReject = confirm("Are you sure you want to reject this leave request?");
      if (confirmReject) {
        approveBtn.disabled = true;
        rejectBtn.disabled = true;

        updateLeaveStatus(id, 'rejeté', row);
      }
    });
  });
}

// Function to update leave status (accept or reject) and remove the row from the table
function updateLeaveStatus(id, status, row) {
  console.log("Updating leave status for ID:", id, "with status:", status);

  fetch(`/api/conges/${id}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    body: JSON.stringify({ statut: status })
  })
  .then(res => {
    if (res.ok) {
      loadLeaveRequests();  // إعادة تحميل الجدول بدلًا من حذف الصف يدويًا
      alert(`تم ${status === 'accepté' ? 'قبول' : 'رفض'} الطلب`);
    } else {
      console.error('فشل في تحديث حالة الطلب');
    }
  })
}

// Function to get CSRF token from cookies
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    if (cookie.trim().startsWith('csrftoken=')) {
      csrfToken = cookie.trim().substring('csrftoken='.length);
    }
  });
  return csrfToken;
}

// Re-enable buttons after changing status or based on new conditions
function enableButtonsForRow(row, status) {
  const approveBtn = row.querySelector('.approve');
  const rejectBtn = row.querySelector('.reject');

  // Re-enable buttons if the status is back to "en attente" (pending)
  if (status === 'en attente') {
    approveBtn.disabled = false;
    rejectBtn.disabled = false;
  }
}

// Function to get CSRF token from cookies
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    if (cookie.trim().startsWith('csrftoken=')) {
      csrfToken = cookie.trim().substring('csrftoken='.length);
    }
  });
  return csrfToken;
}

// Initialize the page

// دالة لإعداد البحث عن طلبات الإجازة
function setupLeaveSearch() {
  const searchInput = document.querySelector('.search-wrapper input');  // حقل البحث
  const searchButton = document.querySelector('.search-wrapper button');  // زر البحث
  const tbody = document.getElementById("leave-body");  // الجسم (tbody) للجدول

  // التعامل مع البحث عند الضغط على زر البحث
  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim().toLowerCase();  // الحصول على النص المدخل وتحويله إلى حروف صغيرة
    filterLeaveData(searchTerm);  // استدعاء دالة الفلترة
  });

  // التعامل مع البحث عند الضغط على مفتاح 'Enter' في حقل الإدخال
  searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const searchTerm = searchInput.value.trim().toLowerCase();  // الحصول على النص المدخل وتحويله إلى حروف صغيرة
      filterLeaveData(searchTerm);  // استدعاء دالة الفلترة
    }
  });

  // دالة لتصفية بيانات طلبات الإجازة
  function filterLeaveData(searchTerm) {
    const rows = tbody.getElementsByTagName("tr");  // الحصول على جميع الصفوف في الجدول
    let matchFound = false;  // علم لتتبع إذا تم العثور على تطابق

    Array.from(rows).forEach(row => {
      const nameCell = row.cells[0];  // خلية 'الاسم' في العمود الأول
      const employeeName = nameCell ? nameCell.textContent.toLowerCase() : '';  // الحصول على النص في خلية الاسم

      // إذا كان النص في الخلية يحتوي على النص المدخل في حقل البحث
      if (employeeName.includes(searchTerm)) {
        row.style.display = '';  // إظهار الصف
        matchFound = true;  // تم العثور على تطابق
      } else {
        row.style.display = 'none';  // إخفاء الصف
      }
    });

    // إذا لم يتم العثور على تطابقات، عرض رسالة "لا توجد نتائج"
    if (!matchFound) {
      tbody.innerHTML = '<tr><td colspan="6">لا توجد طلبات إجازة مطابقة</td></tr>';
    }
  }
}

// تهيئة وظيفة البحث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  setupLeaveSearch();  // تهيئة البحث لطلبات الإجازة
});



// Function to fetch and display payroll data
// Load payroll data
function loadPayrollData() {
  fetch("/api/payroll/")
    .then(response => {
      if (!response.ok) throw new Error("Error fetching payslip data");
      return response.json();
    })
    .then(data => {
      const tbody = document.getElementById("payroll-body");
      tbody.innerHTML = ""; // Clear old data

      data.forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="checkbox" class="select-payroll" value="${emp.id}"></td>
          <td>${emp.name}</td>
          <td>${emp.month}</td>
          <td>${emp.gross.toFixed(2)} DA</td>
          <td>${emp.deductions.toFixed(2)} DA</td>
          <td>${emp.net.toFixed(2)} DA</td>
          <td class="status1 ${emp.status_pyment === 'Paid' ? 'paid' : 'pending'}">${emp.status_pyment}</td>
          <td>
            <button class="print" data-id="${emp.id}">🖨 Print</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      attachEventListeners(); // Setup listeners after DOM update
    })
    .catch(error => console.error("Error fetching payslip data:", error));
}

// Attach listeners for print, mark paid, select all
function attachEventListeners() {
  // Mark as Paid
  document.getElementById("mark-paid").addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(".select-payroll:checked");
    const selected = Array.from(checkboxes);
  
    if (selected.length === 0) {
      alert("Please select at least one payslip.");
      return;
    }
  
    const unpaidIds = [];
    const alreadyPaid = [];
  
    selected.forEach(cb => {
      const row = cb.closest("tr");
      const statusCell = row.querySelector(".status1");
      if (statusCell && statusCell.textContent.trim() === "Paid") {
        alreadyPaid.push(cb.value);
      } else {
        unpaidIds.push(cb.value);
      }
    });
  
    if (unpaidIds.length === 0) {
      alert("Selected payslips are already marked as Paid.");
      return;
    }
  
    // Proceed to update only unpaid payslips
    fetch("/api/payroll/update-status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({ ids: unpaidIds })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error updating payment status");
        return res.json();
      })
      .then(() => {
        alert("Status updated successfully!");
        loadPayrollData(); // Refresh data
      })
      .catch(err => console.error("Error updating status:", err));
  });
  

  // Select All Checkbox
  document.getElementById("select-all").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".select-payroll");
    checkboxes.forEach(cb => (cb.checked = this.checked));
  });

  // Print buttons
// Print buttons
const printButtons = document.querySelectorAll(".print");
printButtons.forEach(button => {
  button.addEventListener("click", () => {
    const payslipId = button.getAttribute("data-id");

    // Fetch the specific payslip data from the backend
    fetch(`/api/payroll/${payslipId}/`)
      .then(response => {
        if (!response.ok) throw new Error("Error fetching payslip data");
        return response.json();
      })
      .then(payslip => {
        printPayslip(payslip); // Use fetched data to print
      })
      .catch(error => console.error("Error printing payslip:", error));
  });
});

  
}

// Print payslip using jsPDF
function printPayslip(payslip) {
  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Bulletin de Paie</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 30px; background-color: #f4f4f4; }
          h1 { text-align: center; font-size: 24px; color: #333; }
          p { font-size: 16px; color: #333; margin: 10px 0; }
          .payslip-container { max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .payslip-header { text-align: center; margin-bottom: 20px; }
          .payslip-footer { margin-top: 30px; text-align: center; }
          .signature-line { margin-top: 40px; border-top: 1px solid #000; width: 300px; margin-left: auto; margin-right: auto; }
          .bold { font-weight: bold; }
          .details { margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="payslip-container">
          <div class="payslip-header">
            <h1>Bulletin de Paie</h1>
          </div>
          <div class="details">
            <p><span class="bold">Nom Employé:</span> ${payslip.employee || 'Inconnu'}</p>
            <p><span class="bold">Mois:</span> ${payslip.mois || '—'}</p>
            <p><span class="bold">Montant Net:</span> ${payslip.montant_net?.toFixed(2) || '0.00'} DA</p>
            <p><span class="bold">Statut:</span> ${payslip.status_pyment || '—'}</p>
          </div>
          <div class="payslip-footer">
            <p class="signature-line"></p>
            <p>Signature</p>
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Search filter
function setupPayrollSearch() {
  const searchInput = document.getElementById("payroll-search");
  const searchButton = document.getElementById("payroll-search-btn");  // Assuming you have a button to trigger search

  if (!searchInput || !searchButton) return;

  // Listen for input change to filter immediately
  searchInput.addEventListener("input", function () {
    filterPayroll(searchInput.value);
  });

  // Listen for button click to trigger search
  searchButton.addEventListener("click", function () {
    filterPayroll(searchInput.value);
  });

  function filterPayroll(searchTerm) {
    const rows = document.querySelectorAll("#payroll-body tr");
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    rows.forEach(row => {
      const name = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
      const month = row.querySelector("td:nth-child(3)").textContent.toLowerCase();

      if (name.includes(lowerCaseSearchTerm) || month.includes(lowerCaseSearchTerm)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
}


// CSRF helper
function getCSRFToken() {
  const match = document.cookie.match(/csrftoken=([\w-]+)/);
  return match ? match[1] : "";
}

// Init on page load
document.addEventListener("DOMContentLoaded", () => {
  loadPayrollData();
  setupPayrollSearch();
});

function renderChartsFromData(data) {
  console.log('Data received for charts:', data);

  // Validate the data structure
  if (!data || data.total_employes === undefined || data.total_candidats === undefined || data.total_absences === undefined) {
    console.error('Invalid data received:', data);
    return;
  }

  if (window.workforceChart instanceof Chart) {
    window.workforceChart.destroy();
  }
  if (window.departementChart instanceof Chart) {
    window.departementChart.destroy();
  }

  // Donut Chart for Workforce
  const workforceActive = data.total_employes;
  const workforceInactive = data.total_candidats + data.total_absences;

  const workforceData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      label: 'Workforce',
      data: [workforceActive, workforceInactive],
      backgroundColor: ['#007bff', '#dcdcdc'],
      borderColor: ['#0056b3', '#cfcfcf'],
      borderWidth: [16, 3],
      cutout: '50%' // Donut chart style
    }]
  };

  window.workforceChart = new Chart(document.getElementById('workforceChart'), {
    type: 'doughnut',
    data: workforceData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 15,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw;
            }
          }
        }
      }
    }
  });

  // Bar Chart for Departement
  fetch('/api/employes-by-dept/')
  .then(response => response.json())
  .then(data => {
    console.log("DATA DEPARTEMENT >>>", data);  // Check if the data contains the 'departements' key

    if (data.departements) {
      console.log("DEPARTEMENTS RAW >>>", data.departements);

      const labels = data.departements.map(item => item.departement);
      const counts = data.departements.map(item => item.count);

      const ctx = document.getElementById('departementChart').getContext('2d');
      window.departementChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'عدد الموظفين حسب القسم',
            data: counts,
            backgroundColor: ['#007bff', '#dcdcdc', '#007bff'],
            borderColor: ['#0056b3', '#cfcfcf', '#0056b3'],
            borderWidth: 4,
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'عدد الموظفين'
              }
            },
            x: {
              title: {
                display: true,
                text: 'الأقسام'
              }
            }
          }
        }
      });
    } else {
      console.error("Data format error: 'departements' key not found.");
    }
  })
  .catch(error => console.error('Error loading department data:', error));
}

// Function to load the dashboard data
function loadDashboardData() {
  fetch('/api/dashboard-data/')
    .then(response => response.json())
    .then(data => {
      console.log("DATA RECEIVED >>>", data);

      // Update summary data
      document.getElementById('employes-count').innerText = data.total_employes;
      document.getElementById('candidats-count').innerText = data.total_candidats;
      document.getElementById('absences-count').innerText = data.total_absences;

      // Re-render charts with the new data
      renderChartsFromData(data);
    })
    .catch(error => {
      console.error("Error loading dashboard data:", error);
    });
}

// Bind the loadDashboardData function to the "Dashboard" button
document.querySelector('button.active').addEventListener('click', loadDashboardData);

// Initial page load to populate the dashboard with data
window.onload = loadDashboardData;

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

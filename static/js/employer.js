console.log('Personal dashboard loaded');
const menuButtons = document.querySelectorAll('.menu button');
const mainContent = document.querySelector('.main');

// Define content for each section
const sections = {
  dashboard:`
 
     
   `,
  leave: `
 <!-- Leave Section -->
<div id="leave-section">
  <h1>My time-off requests</h1>
  <p>View your leave requests here.</p>

  <div class="card">
    <h2>Historique</h2>
    <ul>
      <li><strong>Annual Leave</strong> – Jan 5–10 – <span class="status approved">Approved</span></li>
      <li><strong>Sick Leave</strong> – Feb 12–14 – <span class="status pending">Pending</span></li>
      <li><strong>Casual Leave</strong> – Mar 2–3 – <span class="status rejected">Rejected</span></li>
    </ul>
  </div>

  <button class="request-btn" onclick="toggleLeaveForm()">➕ Send request</button>

  <!-- Hidden Leave Request Form -->
  <div id="leave-form-modal" class="form-modal">
    <div class="form-card">
      <h2>Demande de Congé</h2>
      <div class="form-row">
        <label>First Name:</label>
        <input type="text" placeholder="John">
        <label>Last Name:</label>
        <input type="text" placeholder="Doe">
      </div>
      <div class="form-row">
        <label>Email:</label>
        <input type="email" placeholder="john.doe@example.com">
      </div>
      <div class="form-row">
        <label>Start Date:</label>
        <input type="date">
        <label>End Date:</label>
        <input type="date">
      </div>
      <div class="form-row">
        <label>Grade:</label>
        <input type="text" placeholder="A1 / Manager etc.">
      </div>
      <div class="form-row">
        <label>Cause:</label>
        <select>
          <option>Annual</option>
          <option>Sick</option>
          <option>Casual</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-row">
        <button class="send-btn">Send request</button>
        <button class="cancel-btn" onclick="toggleLeaveForm()">Cancel</button>
      </div>
    </div>
  </div>
</div>

  `,
  evaluation: `
    <h1>Mes Évaluations</h1>
    <div class="card">
      <h2>Performance Review - March 2025</h2>
      <p><strong>Score:</strong> 4.5/5 ⭐</p>
      <p><strong>Comments:</strong> Great leadership and adaptability.</p>
    </div>
  `,
  payroll: `

  <div class="payslip-header">
    <h1>Latest Payslip</h1>
    <p><strong>March 2025</strong></p>
  </div>

  <div class="payslip-grid">
    <div class="card">
      <h3>This Month</h3>
      <p class="amount">80,000 DZ</p>
      <p class="status positive">⬆️ Increase compared to last month</p>
    </div>
    <div class="card">
      <h3>Deduction</h3>
      <p class="amount">0%</p>
      <p class="status positive">⬆️ Increase compared to last month</p>
    </div>
    <div class="card">
      <h3>Gross Salary</h3>
      <p class="amount">80,000 DZ</p>
      <p class="status positive">⬆️ Increase compared to last month</p>
    </div>
    <div class="card">
      <h3>Net Salary</h3>
      <p class="amount">100%</p>
      <p class="status good">✅ Good compared to last month</p>
    </div>
  </div>

  <div class="month-selector">
    <label for="month">Search by Month   </label>
    <select id="month">
      <option selected>March</option>
      <option>April</option>
      <option>May</option>
    </select>
  </div>

  <!-- 🖨️ Print Button -->
  <div class="print-section">
    <button onclick="window.print()" class="print-btn">🖨️ Print Payslip</button>
  </div>
`,
  profile: `
    <h1>Mon Profil</h1>
    <div class="card">
      <h2>Profil Personnel</h2>
      <p><strong>Nom:</strong> Ahmed Naoumi</p>
      <p><strong>Email:</strong> ahmednaoumi15@yahoo.com</p>
      <p><strong>Poste:</strong> HR Manager</p>
    </div>
  `
};

// Event listener for menu buttons
menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    menuButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const section = button.dataset.section;

    if (section === 'dashboard') {
      loadDashboard(); // fetch and display dashboard
    } else {
      mainContent.innerHTML = sections[section] || `<h1>${section}</h1><p>Content coming soon...</p>`;
    }
  });
});





// Event listener for profile button (to navigate to profile section)
document.querySelector('.profile-btn').addEventListener('click', () => {
  const profileSection = 'profile';
  // Set the active button in the sidebar
  menuButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-section="profile"]`).classList.add('active');

  // Load profile content
  mainContent.innerHTML = sections[profileSection];
});
function toggleLeaveForm() {
  const form = document.getElementById('leave-form-modal');
  form.classList.toggle('show');
}

function loadDashboard() {
  fetch('/dashboard-data-emp/')
    .then(response => response.json())
    .then(data => {
      const dashboardHTML = `
        <h1>Welcome Back, ${data.full_name}</h1>
        <p>Here is the information about all the center details</p>
        <div class="container">
          <div class="card">
            <h2>Personal Information</h2>
            <div class="info-grid">
              <div class="info-item"><strong>Full Name:</strong> ${data.full_name}</div>
              <div class="info-item"><strong>Position:</strong> ${data.poste}</div>
              <div class="info-item"><strong>Email:</strong> ${data.email}</div>
              <div class="info-item"><strong>Employee ID:</strong> EMP-${data.employee_id.toString().padStart(5, '0')}</div>
              <div class="info-item"><strong>Department:</strong> ${data.departement}</div>
              <div class="info-item"><strong>Join Date:</strong> ${data.date_embauche}</div>
              
            </div>
          </div>
        </div>
      `;
      mainContent.innerHTML = dashboardHTML;
    })
    .catch(error => {
      console.error('Error loading dashboard data:', error);
    });
}


// استدعاء أولي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  loadDashboard(); // أول شيء نعرض بيانات الداشبورد مباشرة
});




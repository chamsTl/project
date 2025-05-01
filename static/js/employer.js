/**
 * Enhanced Employee Dashboard JavaScript
 * 
 * This file handles all client-side functionality for the employee dashboard,
 * including section navigation, API calls, and data display.
 */

// Constants and cached DOM elements
const ENDPOINTS = {
  dashboard: '/dashboard-data-emp/',
  leaves: '/api/leave/',
  createLeave: '/api/leave/create/',
  evaluations: '/api/evaluations/',
  payslips: '/api/payslips/',
  contracts: '/api/contracts/'
};

const menuButtons = document.querySelectorAll('.menu button');
const mainContent = document.querySelector('.main');

// ============================================================
// Section Content Templates
// ============================================================

/**
 * Defines the HTML content for each section
 */
const sectionTemplates = {
  // Dashboard content is loaded dynamically via API
  dashboard: '',
  
  leave: `
    <!-- Leave Section -->
    <div id="leave-section">
      <h1>My time-off requests</h1>
      <p>View and manage your leave requests here.</p>

      <div class="card" id="leave-history">
        <h2>Leave History</h2>
        <div id="leave-loader">Loading leave history...</div>
        <ul id="leave-list"></ul>
      </div>

      <button class="request-btn" onclick="toggleLeaveForm()">➕ Send request</button>

      <!-- Leave Request Form -->
      <div id="leave-form-modal" class="form-modal">
        <div class="form-card">
          <h2>Leave Request</h2>
          <div class="form-row">
            <label>Leave Type:</label>
            <select id="leave-type">
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-row">
            <label>Start Date:</label>
            <input type="date" id="leave-start-date">
            <label>End Date:</label>
            <input type="date" id="leave-end-date">
          </div>
          <div class="form-row">
            <label>Reason:</label>
            <textarea id="leave-reason" rows="3" placeholder="Provide details about your leave request"></textarea>
          </div>
          <div class="form-row">
            <button class="send-btn" onclick="submitLeaveRequest()">Send request</button>
            <button class="cancel-btn" onclick="toggleLeaveForm()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  
  evaluation: `
    <h1>My Evaluations</h1>
    <p>View your performance evaluations and feedback.</p>
    <div id="evaluations-container"></div>
  `,
  
  payroll: `
    <div class="payslip-header">
      <h1>My Payslips</h1>
      <p>View and download your payslips</p>
    </div>

    <div class="month-selector">
      <label for="month">Search by Month: </label>
      <select id="month" onchange="filterPayslips()">
        <option value="all">All Months</option>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
    </div>

    <div id="payslips-container" class="payslip-grid">
      <!-- Payslips will be loaded here -->
      <div id="payslip-loader">Loading your payslips...</div>
    </div>

    <!-- Print Button -->
    <div class="print-section">
      <button onclick="printSelectedPayslip()" class="print-btn">🖨️ Print Selected Payslip</button>
    </div>
  `,
  
  contracts: `
    <h1>My Contracts</h1>
    <p>View your employment contracts and details.</p>
    <div id="contracts-container">
      <!-- Contracts will be loaded here -->
      <div id="contract-loader">Loading your contracts...</div>
    </div>
  `,
  
  profile: `
    <h1>My Profile</h1>
    <p>View and update your personal information.</p>
    <div id="profile-container" class="card">
      <!-- Profile data will be loaded here -->
      <div id="profile-loader">Loading your profile...</div>
    </div>
    <button class="edit-profile-btn" onclick="toggleProfileEditForm()">✏️ Edit Profile</button>
    
    <!-- Profile Edit Form (hidden by default) -->
    <div id="profile-edit-modal" class="form-modal">
      <div class="form-card">
        <h2>Edit Profile</h2>
        <div id="profile-edit-form">
          <!-- Profile form fields will be loaded here -->
        </div>
      </div>
    </div>
  `
};

// ============================================================
// Navigation and Initialization
// ============================================================

/**
 * Initialize the dashboard
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Personal dashboard loaded');
  loadDashboard();
  
  // Add event listeners to menu buttons
  initializeEventListeners();
});

/**
 * Set up all event listeners
 */
function initializeEventListeners() {
  // Menu button navigation
  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const section = button.dataset.section;
      navigateToSection(section);
    });
  });
  
  // Profile button in header
  const profileBtn = document.querySelector('.profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      menuButtons.forEach(btn => btn.classList.remove('active'));
      const profileButton = document.querySelector('[data-section="profile"]');
      if (profileButton) {
        profileButton.classList.add('active');
      }
      navigateToSection('profile');
    });
  }
}

/**
 * Navigate to a specific section
 */
function navigateToSection(section) {
  if (section === 'dashboard') {
    loadDashboard();
  } else {
    mainContent.innerHTML = sectionTemplates[section] || `<h1>${section}</h1><p>Content coming soon...</p>`;
    
    // Load data for the section
    switch(section) {
      case 'leave':
        loadLeaveRequests();
        break;
      case 'evaluation':
        loadEvaluations();
        break;
      case 'payroll':
        loadPayslips();
        break;
      case 'contracts':
        loadContracts();
        break;
      case 'profile':
        loadProfileData();
        break;
    }
  }
}

// ============================================================
// Dashboard Section
// ============================================================

/**
 * Load the dashboard data and render it
 */
function loadDashboard() {
  fetch(ENDPOINTS.dashboard)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const dashboardHTML = `
        <h1>Welcome Back, ${data.full_name}</h1>
        <p>Here is your employee information and dashboard</p>
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
          
          <!-- Recent Activity Summary -->
          <div class="card">
            <h2>Recent Activity</h2>
            <div class="activity-container">
              <div class="activity-item">
                <div class="activity-icon leave-icon">🗓️</div>
                <div class="activity-details">
                  <h3>Leave Requests</h3>
                  <p>Loading...</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon eval-icon">⭐</div>
                <div class="activity-details">
                  <h3>Latest Evaluation</h3>
                  <p>Loading...</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon payroll-icon">💰</div>
                <div class="activity-details">
                  <h3>Latest Payslip</h3>
                  <p>Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      mainContent.innerHTML = dashboardHTML;
      
      // Load summary data for dashboard
      loadDashboardSummaryData();
    })
    .catch(error => {
      console.error('Error loading dashboard data:', error);
      mainContent.innerHTML = `
        <h1>Dashboard</h1>
        <div class="error-message">
          <p>Error loading dashboard data. Please try refreshing the page.</p>
          <p>Technical details: ${error.message}</p>
        </div>
      `;
    });
}

/**
 * Load summary data for the dashboard
 */
function loadDashboardSummaryData() {
  // Load leave request summary
  fetch(ENDPOINTS.leaves)
    .then(response => response.json())
    .then(data => {
      const pendingLeaves = data.filter(leave => leave.status === 'en attente').length;
      const leaveElement = document.querySelector('.leave-icon + .activity-details p');
      if (leaveElement) {
        leaveElement.textContent = `${pendingLeaves} pending request(s)`;
      }
    })
    .catch(error => console.error('Error loading leave summary:', error));
  
  // Load evaluation summary
  fetch(ENDPOINTS.evaluations)
    .then(response => response.json())
    .then(data => {
      const evalElement = document.querySelector('.eval-icon + .activity-details p');
      if (evalElement) {
        if (data.length > 0) {
          const latestEval = data[0]; // Assuming sorted by date
          evalElement.textContent = `Score: ${latestEval.score}/5 (${latestEval.date})`;
        } else {
          evalElement.textContent = 'No evaluations yet';
        }
      }
    })
    .catch(error => console.error('Error loading evaluation summary:', error));
  
  // Load payslip summary
  fetch(ENDPOINTS.payslips)
    .then(response => response.json())
    .then(data => {
      const payrollElement = document.querySelector('.payroll-icon + .activity-details p');
      if (payrollElement) {
        if (data.length > 0) {
          const latestPayslip = data[0]; // Assuming sorted by date
          payrollElement.textContent = `${latestPayslip.month} ${latestPayslip.year}: ${latestPayslip.net_amount} DZ`;
        } else {
          payrollElement.textContent = 'No payslips available';
        }
      }
    })
    .catch(error => console.error('Error loading payslip summary:', error));
}

// ============================================================
// Leave Section
// ============================================================

/**
 * Toggle the leave request form visibility
 */
function toggleLeaveForm() {
  const form = document.getElementById('leave-form-modal');
  form.classList.toggle('show');
}

/**
 * Load employee's leave requests
 */
function loadLeaveRequests() {
  const leaveList = document.getElementById('leave-list');
  const leaveLoader = document.getElementById('leave-loader');
  
  if (!leaveList || !leaveLoader) return;
  
  fetch(ENDPOINTS.leaves)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      leaveLoader.style.display = 'none';
      
      if (data.length === 0) {
        leaveList.innerHTML = '<p>No leave requests found.</p>';
        return;
      }
      
      let leaveHTML = '';
      data.forEach(leave => {
        // Map status to more user-friendly text and CSS class
        let statusClass, statusText;
        switch(leave.status) {
          case 'en attente':
            statusClass = 'pending';
            statusText = 'Pending';
            break;
          case 'accepté':
            statusClass = 'approved';
            statusText = 'Approved';
            break;
          case 'rejeté':
            statusClass = 'rejected';
            statusText = 'Rejected';
            break;
          case 'annulé':
            statusClass = 'cancelled';
            statusText = 'Cancelled';
            break;
          default:
            statusClass = 'pending';
            statusText = leave.status;
        }
        
        leaveHTML += `
          <li>
            <strong>${leave.reason.substring(0, 20)}${leave.reason.length > 20 ? '...' : ''}</strong> – 
            ${formatDate(leave.start_date)} to ${formatDate(leave.end_date)} – 
            <span class="status ${statusClass}">${statusText}</span>
            ${leave.status === 'en attente' ? 
              `<button class="cancel-leave-btn" onclick="cancelLeaveRequest(${leave.id})">❌ Cancel</button>` : 
              ''}
          </li>
        `;
      });
      
      leaveList.innerHTML = leaveHTML;
    })
    .catch(error => {
      console.error('Error loading leave requests:', error);
      leaveLoader.textContent = `Error loading leave requests: ${error.message}`;
    });
}

/**
 * Submit a new leave request
 */
function submitLeaveRequest() {
  const leaveType = document.getElementById('leave-type').value;
  const startDate = document.getElementById('leave-start-date').value;
  const endDate = document.getElementById('leave-end-date').value;
  const reason = document.getElementById('leave-reason').value;
  
  // Validate inputs
  if (!startDate || !endDate || !reason) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Create request payload
  const leaveData = {
    start_date: startDate,
    end_date: endDate,
    reason: `${leaveType.charAt(0).toUpperCase() + leaveType.slice(1)} Leave: ${reason}`
  };
  
  // Send request to server
  fetch(ENDPOINTS.createLeave, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken()
    },
    body: JSON.stringify(leaveData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Reset form
    document.getElementById('leave-reason').value = '';
    document.getElementById('leave-start-date').value = '';
    document.getElementById('leave-end-date').value = '';
    
    // Hide form
    toggleLeaveForm();
    
    // Reload leave requests
    loadLeaveRequests();
    
    // Show success message
    alert('Leave request submitted successfully!');
  })
  .catch(error => {
    console.error('Error submitting leave request:', error);
    alert(`Failed to submit leave request: ${error.message}`);
  });
}

/**
 * Cancel a pending leave request
 */
function cancelLeaveRequest(leaveId) {
  if (!confirm('Are you sure you want to cancel this leave request?')) {
    return;
  }
  
  fetch(`/api/leave/${leaveId}/cancel/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken()
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Reload leave requests
    loadLeaveRequests();
  })
  .catch(error => {
    console.error('Error cancelling leave request:', error);
    alert(`Failed to cancel leave request: ${error.message}`);
  });
}

// ============================================================
// Evaluation Section
// ============================================================

/**
 * Load employee's evaluations
 */
function loadEvaluations() {
  const evaluationsContainer = document.getElementById('evaluations-container');
  
  if (!evaluationsContainer) return;
  
  evaluationsContainer.innerHTML = '<div id="evaluation-loader">Loading your evaluations...</div>';
  
  fetch(ENDPOINTS.evaluations)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        evaluationsContainer.innerHTML = '<p>No evaluations found.</p>';
        return;
      }
      
      let evaluationsHTML = '';
      data.forEach(evaluation => {
        // Map score to star rating
        const stars = '⭐'.repeat(evaluation.score);
        
        evaluationsHTML += `
          <div class="card evaluation-card">
            <div class="evaluation-header">
              <h2>${evaluation.category} Evaluation</h2>
              <span class="evaluation-date">${formatDate(evaluation.date)}</span>
            </div>
            <p class="evaluation-score"><strong>Score:</strong> ${stars} (${evaluation.score}/5)</p>
            <p class="evaluation-comment"><strong>Comments:</strong> ${evaluation.comment}</p>
            <p class="evaluation-by"><em>Evaluated by: ${evaluation.evaluator}</em></p>
          </div>
        `;
      });
      
      evaluationsContainer.innerHTML = evaluationsHTML;
    })
    .catch(error => {
      console.error('Error loading evaluations:', error);
      evaluationsContainer.innerHTML = `<p class="error">Error loading evaluations: ${error.message}</p>`;
    });
}

// ============================================================
// Payroll Section
// ============================================================

/**
 * Load employee's payslips
 */
function loadPayslips() {
  const payslipsContainer = document.getElementById('payslips-container');
  const payslipLoader = document.getElementById('payslip-loader');
  
  if (!payslipsContainer || !payslipLoader) return;
  
  fetch(ENDPOINTS.payslips)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      payslipLoader.style.display = 'none';
      
      if (data.length === 0) {
        payslipsContainer.innerHTML = '<p>No payslips available.</p>';
        return;
      }
      
      // Store payslips in global variable for filtering
      window.allPayslips = data;
      
      // Display all payslips
      displayPayslips(data);
    })
    .catch(error => {
      console.error('Error loading payslips:', error);
      payslipsContainer.innerHTML = `<p class="error">Error loading payslips: ${error.message}</p>`;
    });
}

/**
 * Display payslips in the container
 */
function displayPayslips(payslips) {
  const payslipsContainer = document.getElementById('payslips-container');
  
  if (!payslipsContainer) return;
  
  let payslipsHTML = '';
  
  payslips.forEach(payslip => {
    payslipsHTML += `
      <div class="card payslip-card" data-id="${payslip.id}">
        <h3>${payslip.month} ${payslip.year}</h3>
        <p class="amount">${payslip.net_amount} DZ</p>
        <div class="payslip-details">
          <p><strong>Gross:</strong> ${payslip.gross_amount} DZ</p>
          <p><strong>Deductions:</strong> ${payslip.deductions} DZ</p>
          <p><strong>Status:</strong> ${payslip.status}</p>
        </div>
        <div class="payslip-actions">
          <button onclick="selectPayslip(${payslip.id})" class="select-btn">Select</button>
          ${payslip.pdf_url ? `<a href="${payslip.pdf_url}" target="_blank" class="download-btn">Download PDF</a>` : ''}
        </div>
      </div>
    `;
  });
  
  payslipsContainer.innerHTML = payslipsHTML || '<p>No payslips match your filter.</p>';
}

/**
 * Filter payslips by month
 */
function filterPayslips() {
  const month = document.getElementById('month').value;
  
  if (!window.allPayslips) return;
  
  if (month === 'all') {
    displayPayslips(window.allPayslips);
  } else {
    const filtered = window.allPayslips.filter(payslip => payslip.month === month);
    displayPayslips(filtered);
  }
}

/**
 * Select a payslip for printing
 */
function selectPayslip(payslipId) {
  // Remove selection from all payslips
  document.querySelectorAll('.payslip-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selection to clicked payslip
  const selectedCard = document.querySelector(`.payslip-card[data-id="${payslipId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
    window.selectedPayslipId = payslipId;
  }
}

/**
 * Print the selected payslip
 */
function printSelectedPayslip() {
  if (!window.selectedPayslipId) {
    alert('Please select a payslip to print');
    return;
  }
  
  // Get selected payslip details
  fetch(`${ENDPOINTS.payslips}${window.selectedPayslipId}/`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then(payslip => {
      // Create a printable version of the payslip
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payslip - ${payslip.month} ${payslip.year}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .payslip-header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 20px; }
            .employee-info { margin-bottom: 30px; }
            .payslip-details { border: 1px solid #ccc; padding: 20px; margin-bottom: 30px; }
            .amount-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total-row { font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; }
            @media print { body { margin: 0.5cm; } }
          </style>
        </head>
        <body>
          <div class="payslip-header">
            <h1>Payslip</h1>
            <h2>${payslip.month} ${payslip.year}</h2>
          </div>
          
          <div class="company-info">
            <h3>Company Name</h3>
            <p>Address: 123 Business Street, City</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          
          <div class="employee-info">
            <h3>Employee Information</h3>
            <p>Employee ID: ${window.dashboardData ? window.dashboardData.employee_id : 'N/A'}</p>
            <p>Name: ${window.dashboardData ? window.dashboardData.full_name : 'Employee'}</p>
            <p>Position: ${window.dashboardData ? window.dashboardData.poste : 'N/A'}</p>
            <p>Department: ${window.dashboardData ? window.dashboardData.departement : 'N/A'}</p>
          </div>
          
          <div class="payslip-details">
            <h3>Earnings & Deductions</h3>
            
            <div class="amount-row">
              <span>Gross Pay:</span>
              <span>${payslip.gross_amount} DZ</span>
            </div>
            
            <div class="amount-row">
              <span>Deductions:</span>
              <span>${payslip.deductions} DZ</span>
            </div>
            
            <div class="amount-row total-row">
              <span>Net Pay:</span>
              <span>${payslip.net_amount} DZ</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>Printed on: ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    })
    .catch(error => {
      console.error('Error fetching payslip details for printing:', error);
      alert(`Error preparing payslip for printing: ${error.message}`);
    });
}

// ============================================================
// Contracts Section
// ============================================================

/**
 * Load employee's contracts
 */
function loadContracts() {
  const contractsContainer = document.getElementById('contracts-container');
  const contractLoader = document.getElementById('contract-loader');
  
  if (!contractsContainer || !contractLoader) return;
  
  fetch(ENDPOINTS.contracts)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      contractLoader.style.display = 'none';
      
      if (data.length === 0) {
        contractsContainer.innerHTML = '<p>No contracts found.</p>';
        return;
      }
      
      let contractsHTML = '';
      data.forEach(contract => {
        // Determine contract status display
        let statusClass = 'active';
        if (contract.is_near_end) {
          statusClass = 'ending-soon';
        } else if (contract.status === 'terminé') {
          statusClass = 'terminated';
        }
        
        contractsHTML += `
          <div class="card contract-card ${statusClass}">
            <div class="contract-header">
              <h2>${contract.type}</h2>
              <span class="contract-status">${contract.status}</span>
            </div>
            <div class="contract-dates">
              <p><strong>Start Date:</strong> ${formatDate(contract.start_date)}</p>
              <p><strong>End Date:</strong> ${contract.end_date ? formatDate(contract.end_date) : 'Not specified'}</p>
            </div>
            <p class="contract-salary"><strong>Salary:</strong> ${contract.salary} DZ</p>
            ${contract.document_url ? 
              `<div class="contract-actions">
                <a href="${contract.document_url}" target="_blank" class="document-btn">View Document</a>
              </div>` : 
              ''}
            ${contract.is_near_end ? 
              `<div class="contract-warning">
                <p>⚠️ This contract will expire soon!</p>
              </div>` : 
              ''}
          </div>
        `;
      });
      
      contractsContainer.innerHTML = contractsHTML;
    })
    .catch(error => {
      console.error('Error loading contracts:', error);
      contractsContainer.innerHTML = `<p class="error">Error loading contracts: ${error.message}</p>`;
    });
}

// ============================================================
// Profile Section
// ============================================================

/**
 * Load profile data
 */
function loadProfileData() {
  const profileContainer = document.getElementById('profile-container');
  const profileLoader = document.getElementById('profile-loader');
  
  if (!profileContainer || !profileLoader) return;
  
  fetch(ENDPOINTS.dashboard)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Store profile data for use in other functions
      window.profileData = data;
      
      profileLoader.style.display = 'none';
      
      const profileHTML = `
        <div class="profile-header">
          <div class="profile-avatar">
            <div class="avatar-placeholder">${getInitials(data.full_name)}</div>
          </div>
          <div class="profile-name">
            <h2>${data.full_name}</h2>
            <p>${data.poste}</p>
          </div>
        </div>
        <div class="profile-details">
          <div class="profile-section">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> ${data.email}</p>
          </div>
          <div class="profile-section">
            <h3>Employment Information</h3>
            <p><strong>Employee ID:</strong> EMP-${data.employee_id.toString().padStart(5, '0')}</p>
            <p><strong>Department:</strong> ${data.departement}</p>
            <p><strong>Join Date:</strong> ${data.date_embauche}</p>
            <p><strong>Role:</strong> ${data.role || 'N/A'}</p>
          </div>
        </div>
      `;
      
      profileContainer.innerHTML = profileHTML;
    })
    .catch(error => {
      console.error('Error loading profile data:', error);
      profileContainer.innerHTML = `<p class="error">Error loading profile data: ${error.message}</p>`;
    });
}

/**
 * Toggle profile edit form
 */
function toggleProfileEditForm() {
  const profileEditModal = document.getElementById('profile-edit-modal');
  
  if (!profileEditModal) return;
  
  if (!profileEditModal.classList.contains('show')) {
    // Load form with current data
    const profileEditForm = document.getElementById('profile-edit-form');
    if (profileEditForm && window.profileData) {
      const formHTML = `
        <div class="form-row">
          <label>Full Name:</label>
          <input type="text" id="edit-fullname" value="${window.profileData.full_name}">
        </div>
        <div class="form-row">
          <label>Email:</label>
          <input type="email" id="edit-email" value="${window.profileData.email}">
        </div>
        <div class="form-row">
          <label>Phone:</label>
          <input type="tel" id="edit-phone" value="${window.profileData.phone || ''}">
        </div>
        <div class="form-row">
          <h3>Change Password</h3>
          <p class="form-hint">Leave blank if you don't want to change it</p>
        </div>
        <div class="form-row">
          <label>New Password:</label>
          <input type="password" id="edit-password">
        </div>
        <div class="form-row">
          <label>Confirm Password:</label>
          <input type="password" id="edit-confirm-password">
        </div>
        <div class="form-row">
          <button class="save-btn" onclick="saveProfileChanges()">Save Changes</button>
          <button class="cancel-btn" onclick="toggleProfileEditForm()">Cancel</button>
        </div>
      `;
      profileEditForm.innerHTML = formHTML;
    }
  }
  
  profileEditModal.classList.toggle('show');
}

/**
 * Save profile changes
 */
function saveProfileChanges() {
  // Get values from form
  const fullName = document.getElementById('edit-fullname').value;
  const email = document.getElementById('edit-email').value;
  const phone = document.getElementById('edit-phone').value;
  const password = document.getElementById('edit-password').value;
  const confirmPassword = document.getElementById('edit-confirm-password').value;
  
  // Validate inputs
  if (!fullName || !email) {
    alert('Full name and email are required');
    return;
  }
  
  if (password && password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  // Create request payload
  const profileData = {
    fullName: fullName,
    email: email,
    phone: phone
  };
  
  // Add password if provided
  if (password) {
    profileData.password = password;
    profileData.confirmPassword = confirmPassword;
  }
  
  // Send request to server
  fetch('/profile/settings/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken()
    },
    body: JSON.stringify(profileData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Hide form
    toggleProfileEditForm();
    
    // Reload profile data
    loadProfileData();
    
    // Show success message
    alert('Profile updated successfully!');
  })
  .catch(error => {
    console.error('Error updating profile:', error);
    alert(`Failed to update profile: ${error.message}`);
  });
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Format date string to more readable format
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get CSRF token from cookies
 */
function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  
  return cookieValue;
}

/**
 * Get initials from a full name
 */
function getInitials(fullName) {
  if (!fullName) return '?';
  
  const names = fullName.split(' ');
  let initials = '';
  
  for (let i = 0; i < Math.min(names.length, 2); i++) {
    if (names[i][0]) {
      initials += names[i][0].toUpperCase();
    }
  }
  
  return initials || '?';
}
"""
Main URL patterns for the myapp application.

This file combines all URL patterns from different modules.
"""

from django.urls import path, include
from django.contrib import admin
from myapp import views
from myapp.employee_urls import employee_urls

urlpatterns = [
    path('explorer/', include('explorer.urls')),
    # Login and User Management
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    
    # Role-specific Dashboards
    path('', views.post_list, name='post_list'),  # HR Dashboard
    
    # Employee API Endpoints
    path('api/employees/', views.get_employees_data, name='get_employees_data'),
    path('api/employees/<int:employee_id>/promote/', views.promote_employee, name='promote_employee'),
    path('transfer-employee/<int:employee_id>/', views.transfer_employee, name='transfer_employee'),
    
    # Contracts
    path('api/contracts/', views.contract_list, name='contract-list'),
    path('api/contracts/<int:id>/', views.contract_detail, name='contract_detail'),
    path('api/contracts/create/', views.contract_create, name='contract_create'),
    
    # Evaluations
    path('evaluations/', views.evaluation_list, name='evaluation-list'),
    path('evaluations/<int:id>/update/', views.update_evaluation, name='update_evaluation'),
    path('evaluations/<int:id>/delete/', views.delete_evaluation, name='delete_evaluation'),
    path('add_evaluation/', views.add_evaluation, name='add_evaluation'),
    
    # User Utilities
    path('get-user-by-email-or-id/', views.get_user_by_email_or_id, name='get_user_by_email_or_id'),
    
    # Recruitment
    path('api/recruitment/', views.get_recruitment_jobs, name='get_recruitment_jobs'),
    path('api/recruitment/<int:id>/delete/', views.delete_job, name='delete_job'),
    path('api/recruitment/<int:id>/update/', views.update_job, name='update_job'),
    path('api/recruitment/search/', views.search_recruitment_jobs, name='search_recruitment_jobs'),
    
    # Admin Management
    path('admin/', views.admin_dashboard, name='dashboard'),
    path('admin/users/', views.users_view, name='users'),
    path('admin/update_statut/<int:user_id>/', views.update_statut, name='update_statut'),
    path('admin/edit_user/<int:user_id>/', views.edit_user, name='edit_user'),
    path('admin/delete_user/<int:user_id>/', views.delete_user, name='delete_user'),
    path('accept-user/<int:user_id>/', views.accept_user, name='accept_user'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
    path('edit-user/<int:user_id>/', views.edit_user, name='edit_user'),
    path('add_admin/', views.add_admin, name='add_admin'),
    
    # Dashboard Data APIs
    path('api/dashboard-data/', views.dashboard_api, name='dashboard_api'),
    path('api/employes-by-dept/', views.employees_by_department, name='employes_by_dept'),
    
    # Payroll Management
    path('api/payroll/', views.get_all_payrolls, name='get_all_payrolls'),
    path('api/payroll/update-status/', views.update_payment_status, name='update_payment_status'),
    path('api/payroll/<int:payroll_id>/', views.get_single_payroll, name='get_single_payroll'),
    
    # Leave Management for HR
    path('api/conges/', views.get_leave_requests, name='get_leave_requests'),
    path('api/conges/<int:conge_id>/', views.update_leave_status, name='update_leave_status'),
]

# Add all employee-specific URLs
urlpatterns += employee_urls
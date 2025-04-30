from django.contrib import admin
from django.urls import path, include
from myapp import views
from myapp.views import create_job
from myapp.views import evaluation_list, delete_job, update_job, add_evaluation
from myapp.views import get_all_payrolls 
from myapp.views import get_leave_requests
from myapp.views import update_leave_status
from myapp.views import update_payment_status
from myapp.views import get_single_payroll

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('add_evaluation/', views.add_evaluation, name='add_evaluation'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('employer/', views.employer, name='employer'),
    # 🧠 الموظفين
    path('api/employees/', views.get_employees_data, name='get_employees_data'),
    path('api/employees/<int:employee_id>/promote/', views.promote_employee, name='promote_employee'),
    path('transfer-employee/<int:employee_id>/', views.transfer_employee, name='transfer_employee'),
    # 📜 العقود
    path('api/contracts/', views.contract_list, name='contract-list'),
    path('api/contracts/<int:id>/', views.contract_detail, name='contract_detail'),
    path('api/contracts/create/', views.contract_create, name='contract_create'),
    # 📊 التقييمات
    path('evaluations/', evaluation_list, name='evaluation-list'),
    path('evaluations/<int:id>/update/', views.update_evaluation, name='update_evaluation'),
    path('evaluations/<int:id>/delete/', views.delete_evaluation, name='delete_evaluation'),
    path('add_evaluation/', views.add_evaluation, name='add_evaluation'),
    path('get-user-by-email-or-id/', views.get_user_by_email_or_id, name='get_user_by_email_or_id'),
    # 💼 التوظيف (هنا كان النقص)
    path('api/recruitment/', views.get_recruitment_jobs, name='get_recruitment_jobs'),
    path('api/recruitment/<int:id>/delete/', delete_job, name='delete_job'),   # ✅ أضف هذا
    path('api/recruitment/<int:id>/update/', update_job, name='update_job'),   # ✅ وأضف هذا
    path('api/recruitment/', create_job, name='create-job'),
    path('api/recruitment/search/', views.search_recruitment_jobs, name='search_recruitment_jobs'),
    #admin 
     #nour
     path('admin/', views.admin_dashboard, name='dashboard'),
     path('admin/users/', views.users_view, name='users'),
     path('admin/update_statut/<int:user_id>/', views.update_statut, name='update_statut'),
     path('admin/edit_user/<int:user_id>/', views.edit_user, name='edit_user'),
     path('admin/delete_user/<int:user_id>/', views.delete_user, name='delete_user'),
     
     path('accept-user/<int:user_id>/', views.accept_user, name='accept_user'),
     path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
     path('edit-user/<int:user_id>/', views.edit_user, name='edit_user'),
     path('add_admin/', views.add_admin, name='add_admin'),


      
      #party chamechom
    path('api/dashboard-data/', views.dashboard_api, name='dashboard_api'),
    path('api/employes-by-dept/', views.employees_by_department, name='employes_by_dept'),
    path('profile/', views.profile_settings, name='profile_settings'),

    # In your urls.py
    path("api/payroll/", views.get_all_payrolls, name="get_all_payrolls"),
    path("api/payroll/update-status/", views.update_payment_status, name="update_payment_status"),
    path('api/payroll/<int:payroll_id>/', views.get_single_payroll, name='get_single_payroll'),
    path('api/conges/', views.get_leave_requests, name='get_leave_requests'),
    path('api/conges/<int:conge_id>/', views.update_leave_status, name='update_leave_status'),
    #party chamossa
    path('dashboard-data-emp/', views.dashboard_data_emp, name='dashboard-data-emp'),
]


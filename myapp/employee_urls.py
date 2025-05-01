"""
URL patterns for employee-related functionality.

These URLs should be included in the main urls.py file.
"""

from django.urls import path
from . import views
from . import employee_api
from . import employee_views

# Employee Dashboard URLs
employee_urls = [
    # Main dashboard view
    path('employer/', employee_views.employer, name='employer'),  # Keep original URL for backward compatibility
    path('dashboard-data-emp/', employee_views.dashboard_data_emp, name='dashboard-data-emp'),
    
    # Employee Profile
    path('profile/', employee_views.profile_view, name='profile_view'),
    path('profile/settings/', employee_views.profile_settings, name='profile_settings'),
    
    # Employee Leave/Time-off
    path('leave/request/', employee_views.request_leave, name='request_leave'),
    path('leave/my-requests/', employee_views.get_employee_leaves, name='get_employee_leaves'),
    
    # Employee Evaluations
    path('evaluations/my-evaluations/', employee_views.get_employee_evaluations, name='get_employee_evaluations'),
    
    # Employee Contracts
    path('contracts/my-contracts/', employee_views.get_employee_contracts, name='get_employee_contracts'),
    
    # API Endpoints
    path('api/payslips/', employee_api.get_employee_payslips, name='get_employee_payslips'),
    path('api/payslips/<int:payslip_id>/', employee_api.get_payslip_detail, name='get_payslip_detail'),
    
    path('api/leave/create/', employee_api.create_leave_request, name='create_leave_request'),
    path('api/leave/', employee_api.get_leave_requests_for_employee, name='get_leave_requests_for_employee'),
    path('api/leave/<int:leave_id>/cancel/', employee_api.cancel_leave_request, name='cancel_leave_request'),
    
    path('api/evaluations/', employee_api.get_evaluations_for_employee, name='get_evaluations_for_employee'),
    
    path('api/contracts/', employee_api.get_contracts_for_employee, name='get_contracts_for_employee'),
    path('api/contracts/<int:contract_id>/', employee_api.get_contract_detail, name='get_contract_detail'),
]

# This allows you to include these URLs in the main urls.py file
# In the main urls.py, you can add:
# path('', include('myapp.urls')),
# urlpatterns += employee_urls
"""
Employee Views - HR Management System

This module contains all the views related to employee management and interaction.
"""

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.utils import timezone
import json

from .models import Employe, Utilisateur, Contrat, Conge, Evaluation

# ======================================================
# Employee Dashboard Views
# ======================================================

@login_required
def employer(request):
    """Render the main employee dashboard page."""
    return render(request, 'myapp/employer.html')

@login_required
def dashboard_data_emp(request):
    """Retrieve and return employee dashboard data for the current user."""
    user = request.user

    try:
        employe = Employe.objects.get(utilisateur=user)
        data = {
            'full_name': employe.utilisateur.full_name,
            'poste': employe.poste,
            'email': employe.utilisateur.email,
            'employee_id': employe.id,
            'departement': employe.departement,
            'date_embauche': employe.date_embauche.strftime('%B %d, %Y'),
            'role': employe.utilisateur.role.nom_role,
        }
    except Employe.DoesNotExist:
        # Fallback for admin or other non-employee users
        data = {
            'full_name': user.full_name,
            'poste': 'Administrator',
            'email': user.email,
            'employee_id': user.id,
            'departement': 'Administration',
            'date_embauche': user.date_creation.strftime('%B %d, %Y'),
        }

    return JsonResponse(data)

# ======================================================
# Employee Profile Management
# ======================================================

@login_required
def profile_view(request):
    """Show employee profile information."""
    user = request.user
    context = {
        'user': user,
    }
    return render(request, 'myapp/profile.html', context)

@login_required
@csrf_exempt
def profile_settings(request):
    """Handle profile viewing and updating."""
    user = request.user

    if request.method == "GET":
        return render(request, 'myapp/profile_settings.html', {'user': user})

    elif request.method == "POST":
        try:
            data = json.loads(request.body)

            full_name = data.get('fullName')
            username = data.get('username')
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')

            if password and password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match!'}, status=400)

            # Update user information
            if full_name:
                name_parts = full_name.split()
                user.nom = name_parts[0]
                user.prenom = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
            if username:
                user.username = username
            
            if email:
                user.email = email
            
            if phone:
                user.telephone = phone

            if password:
                user.set_password(password)

            user.save()
            return JsonResponse({'success': 'Profile updated successfully.'})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

# ======================================================
# Leave/Time-off Request Management
# ======================================================

@login_required
@csrf_exempt
def request_leave(request):
    """Handle leave/time-off requests from employees."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            start_date = data.get('startDate')
            end_date = data.get('endDate')
            reason = data.get('reason')
            
            if not all([start_date, end_date, reason]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            
            # Get the employee record for the current user
            employee = Employe.objects.get(utilisateur=request.user)
            
            # Create the leave request
            leave = Conge.objects.create(
                employe=employee,
                date_debut=start_date,
                date_fin=end_date,
                raison=reason,
                statut='en attente',
                date_demande=timezone.now()
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Leave request submitted successfully',
                'leave_id': leave.id
            })
            
        except Employe.DoesNotExist:
            return JsonResponse({'error': 'Employee record not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@login_required
def get_employee_leaves(request):
    """Get all leave requests for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        leaves = Conge.objects.filter(employe=employee).order_by('-date_demande')
        
        leave_data = []
        for leave in leaves:
            leave_data.append({
                'id': leave.id,
                'start_date': leave.date_debut.strftime('%Y-%m-%d'),
                'end_date': leave.date_fin.strftime('%Y-%m-%d'),
                'reason': leave.raison,
                'status': leave.statut,
                'request_date': leave.date_demande.strftime('%Y-%m-%d')
            })
            
        return JsonResponse(leave_data, safe=False)
    
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# ======================================================
# Employee Evaluations
# ======================================================

@login_required
def get_employee_evaluations(request):
    """Get all evaluations for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        evaluations = Evaluation.objects.filter(employe=employee).order_by('-date_evaluation')
        
        eval_data = []
        for eval in evaluations:
            eval_data.append({
                'id': eval.id,
                'score': eval.note,
                'comment': eval.commentaire,
                'category': eval.category,
                'date': eval.date_evaluation.strftime('%Y-%m-%d'),
                'evaluator': f"{eval.user.nom} {eval.user.prenom}" if hasattr(eval.user, 'nom') else eval.user.username
            })
            
        return JsonResponse(eval_data, safe=False)
    
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# ======================================================
# Employee Contracts
# ======================================================

@login_required
def get_employee_contracts(request):
    """Get all contracts for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        contracts = Contrat.objects.filter(employe=employee).order_by('-date_debut')
        
        contract_data = []
        for contract in contracts:
            contract_data.append({
                'id': contract.id,
                'type': contract.type_contrat,
                'start_date': contract.date_debut.strftime('%Y-%m-%d'),
                'end_date': contract.date_fin.strftime('%Y-%m-%d') if contract.date_fin else None,
                'salary': str(contract.salaire),
                'status': contract.statut_contrat,
                'document': contract.document.url if contract.document else None,
                'is_near_end': contract.est_pres_de_fin,
            })
            
        return JsonResponse(contract_data, safe=False)
    
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
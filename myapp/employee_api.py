"""
Employer API - HR Management System

This module contains API endpoints for employee-facing features.
"""

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
import json
import logging

from .models import Employe, Contrat, Conge, Evaluation, BulletinPaie, Utilisateur

from django.contrib.auth.models import User # this is very important for handling user auth sessions anf retrieve his data

logger = logging.getLogger(__name__)

# ======================================================
# Employee Payroll API
# ======================================================

@login_required
@require_GET
def get_employee_payslips(request):
    """Get all payslips for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        bulletins = BulletinPaie.objects.filter(employe=employee).order_by('-date_creation')
        
        payslip_data = []
        for bulletin in bulletins:
            # Calculate gross amount (example: net + 20% for taxes)
            net_amount = bulletin.montant_net
            gross_amount = float(net_amount) * 1.2
            deductions = gross_amount - float(net_amount)
            
            payslip_data.append({
                'id': bulletin.id,
                'month': bulletin.mois,
                'year': bulletin.annee,
                'gross_amount': gross_amount,
                'net_amount': float(net_amount),
                'deductions': deductions,
                'status': bulletin.status_pyment,
                'pdf_url': bulletin.fichier_pdf if bulletin.fichier_pdf else None
            })
            
        return JsonResponse(payslip_data, safe=False)
    
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee record not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching payslips: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_GET
def get_payslip_detail(request, payslip_id):
    """Get detailed information about a specific payslip."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        bulletin = BulletinPaie.objects.get(id=payslip_id, employe=employee)
        
        # Calculate gross amount (example: net + 20% for taxes)
        net_amount = bulletin.montant_net
        gross_amount = float(net_amount) * 1.2
        deductions = gross_amount - float(net_amount)
        
        payslip_data = {
            'id': bulletin.id,
            'month': bulletin.mois,
            'year': bulletin.annee,
            'gross_amount': gross_amount,
            'net_amount': float(net_amount),
            'deductions': deductions,
            'status': bulletin.status_pyment,
            'pdf_url': bulletin.fichier_pdf if bulletin.fichier_pdf else None,
            'creation_date': bulletin.date_creation.strftime('%Y-%m-%d')
        }
        
        return JsonResponse(payslip_data)
    
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee record not found'}, status=404)
    except BulletinPaie.DoesNotExist:
        return JsonResponse({'error': 'Payslip not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching payslip details: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

# ======================================================
# Employee Leave Management API
# ======================================================

@login_required
@csrf_exempt
@require_POST
def create_leave_request(request):
    """Create a new leave request."""
    try:
        data = json.loads(request.body)
        user_id = request.user.id
        print(data, user_id)
        
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        reason = data.get('reason')
        
        if not all([start_date, end_date, reason]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        # utilisateur = Utilisateur.objects.get(id=user_id)

        # print(utilisateur)
        
        employee = Employe.objects.get(utilisateur=request.user)

        print(employee)
        
        # Create the leave request
        leave = Conge.objects.create(
            employe=employee,
            date_debut=start_date,
            date_fin=end_date,
            raison=reason,
            statut='en attente'
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Leave request submitted successfully',
            'id': leave.id,
            'status': leave.statut
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)
    except Exception as e:
        logger.error(f"Error creating leave request: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_GET
def get_leave_requests_for_employee(request):
    """Get all leave requests for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        leaves = Conge.objects.filter(employe=employee).order_by('-date_demande')
        
        result = []
        for leave in leaves:
            result.append({
                'id': leave.id,
                'start_date': leave.date_debut.strftime('%Y-%m-%d'),
                'end_date': leave.date_fin.strftime('%Y-%m-%d'),
                'reason': leave.raison,
                'status': leave.statut,
                'request_date': leave.date_demande.strftime('%Y-%m-%d')
            })
        
        return JsonResponse(result, safe=False)
        
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching leave requests: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@csrf_exempt
@require_POST
def cancel_leave_request(request, leave_id):
    """Cancel a pending leave request."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        leave = Conge.objects.get(id=leave_id, employe=employee)
        
        # Only allow cancellation of pending requests
        if leave.statut != 'en attente':
            return JsonResponse({
                'error': 'Only pending leave requests can be cancelled'
            }, status=400)
        
        # Update the leave status
        leave.statut = 'annulé'
        leave.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Leave request cancelled successfully'
        })
        
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)
    except Conge.DoesNotExist:
        return JsonResponse({'error': 'Leave request not found'}, status=404)
    except Exception as e:
        logger.error(f"Error cancelling leave request: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

# ======================================================
# Employee Evaluations API
# ======================================================

@login_required
@require_GET
def get_evaluations_for_employee(request):
    """Get all evaluations for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        evaluations = Evaluation.objects.filter(employe=employee).order_by('-date_evaluation')
        
        result = []
        for evaluation in evaluations:
            result.append({
                'id': evaluation.id,
                'date': evaluation.date_evaluation.strftime('%Y-%m-%d'),
                'category': evaluation.category,
                'score': evaluation.note,
                'comment': evaluation.commentaire,
                'evaluator': f"{evaluation.user.nom} {evaluation.user.prenom}" if hasattr(evaluation.user, 'nom') else "Unknown"
            })
        
        return JsonResponse(result, safe=False)
        
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching evaluations: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

# ======================================================
# Employee Contracts API
# ======================================================

@login_required
@require_GET
def get_contracts_for_employee(request):
    """Get all contracts for the current employee."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        contracts = Contrat.objects.filter(employe=employee).order_by('-date_debut')
        
        result = []
        for contract in contracts:
            result.append({
                'id': contract.id,
                'type': contract.type_contrat,
                'start_date': contract.date_debut.strftime('%Y-%m-%d'),
                'end_date': contract.date_fin.strftime('%Y-%m-%d') if contract.date_fin else None,
                'salary': str(contract.salaire),
                'status': contract.statut_contrat,
                'document_url': contract.document.url if contract.document else None,
                'is_near_end': contract.est_pres_de_fin
            })
        
        return JsonResponse(result, safe=False)
        
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching contracts: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_GET
def get_contract_detail(request, contract_id):
    """Get detailed information about a specific contract."""
    try:
        employee = Employe.objects.get(utilisateur=request.user)
        contract = Contrat.objects.get(id=contract_id, employe=employee)
        
        contract_data = {
            'id': contract.id,
            'type': contract.type_contrat,
            'start_date': contract.date_debut.strftime('%Y-%m-%d'),
            'end_date': contract.date_fin.strftime('%Y-%m-%d') if contract.date_fin else None,
            'salary': str(contract.salaire),
            'status': contract.statut_contrat,
            'document_url': contract.document.url if contract.document else None,
            'is_near_end': contract.est_pres_de_fin,
            'created_at': contract.created_at.strftime('%Y-%m-%d'),
            'updated_at': contract.updated_at.strftime('%Y-%m-%d')
        }
        
        return JsonResponse(contract_data)
        
    except Employe.DoesNotExist:
        return JsonResponse({'error': 'Employee not found'}, status=404)
    except Contrat.DoesNotExist:
        return JsonResponse({'error': 'Contract not found'}, status=404)
    except Exception as e:
        logger.error(f"Error fetching contract details: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
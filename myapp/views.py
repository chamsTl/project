from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Recrutement
from django.core.serializers import serialize
from django.utils import timezone
from django.contrib.auth import authenticate, login
from .models import Employe ,Contrat ,Evaluation ,Utilisateur
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
import json
import logging
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from datetime import datetime
from django.views.decorators.http import require_GET
from functools import wraps

def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('mot_de_passe')

        if not email or not password:
            messages.error(request, "يرجى ملء كل الحقول 📝")
            return render(request, 'myapp/login.html')

        try:
            # البحث عن المستخدم بالبريد الإلكتروني
            user = Utilisateur.objects.get(email=email)

            # التحقق من كلمة المرور
            if user.check_password(password):  # يجب أن تكون الكلمة مشفرة
                if user.statut == 'en_attente':
                    messages.warning(request, "🚧 حسابك قيد الانتظار! الرجاء انتظار موافقة المسؤول.")
                    return render(request, 'myapp/login.html')
                elif user.statut == 'rejete':
                    messages.error(request, "❌ تم رفض حسابك. يرجى الاتصال بالإدارة.")
                    return render(request, 'myapp/login.html')

                # ✅ تسجيل الدخول الرسمي عبر Django
                login(request, user)  # 💫 هذا هو المفتاح السحري

                # ✅ التوجيه حسب الدور
                role = user.role.nom_role.strip().lower()
                if role == 'drh':
                    return redirect('post_list')
                elif role in ['employé', 'employee']:
                    return redirect('employer')
                elif role == 'admin':
                    return redirect('admin_dashboard')
                else:
                    messages.error(request, f'⚠️ دور غير معروف: {role}')
                    return render(request, 'myapp/login.html')

            else:
                messages.error(request, '❌ كلمة المرور غير صحيحة')
                return render(request, 'myapp/login.html')

        except Utilisateur.DoesNotExist:
            messages.error(request, '❌ لا يوجد مستخدم بهذا البريد الإلكتروني')
            return render(request, 'myapp/login.html')

    return render(request, 'myapp/login.html')


def signup(request):
    return render(request, 'myapp/create-account.html')

def post_list(request):
    return render(request, 'myapp/DRH.html')

def admin_dashboard(request):  # 🆕
    return render(request, 'myapp/admin.html')

def employer(request):  
    return render(request, 'myapp/employer.html')

def get_employees_data(request):
    employees = Employe.objects.select_related('utilisateur').all()
    data = []

    for emp in employees:
        data.append({
            "id": emp.id,  # تأكد من إضافة الـ id هنا
            "name": f"{emp.utilisateur.nom} {emp.utilisateur.prenom}",
            "position": emp.poste,
            "department": emp.departement,
            "hireDate": emp.date_embauche.strftime("%Y-%m-%d"),
            "status": emp.statut_employe.capitalize()
        })

    return JsonResponse(data, safe=False)

def promote_employee(request, employee_id):
    if request.method == 'POST':
        try:
            # استخراج بيانات الترقية من الطلب
            promotion_data = json.loads(request.body)
            new_poste = promotion_data.get('newPoste')  # المنصب الجديد

            # التحقق من صحة البيانات المدخلة
            if not new_poste:
                return JsonResponse({"error": "New position is required"}, status=400)

            # البحث عن الموظف باستخدام المعرف
            employee = Employe.objects.get(id=employee_id)

            # تحديث المنصب إلى المنصب الجديد
            employee.poste = new_poste
            employee.save()

            return JsonResponse({"message": "Employee promoted successfully!"}, status=200)

        except Employe.DoesNotExist:
            return JsonResponse({"error": "Employee not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

def add_evaluation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            employee_id = data.get("employe")
            note = data.get("note")
            commentaire = data.get("comment")
            category = data.get("category")

            if not employee_id:
                return JsonResponse({"error": "❌ يرجى إدخال معرف الموظف!"}, status=400)

            if not note:
                return JsonResponse({"error": "❌ يرجى إدخال التقييم!"}, status=400)

            try:
                note = int(note)
            except (ValueError, TypeError):
                return JsonResponse({"error": "❌ التقييم يجب أن يكون رقماً!"}, status=400)

            if not commentaire or not category:
                return JsonResponse({"error": "❌ يجب إدخال التعليق والفئة!"}, status=400)

            # البحث عن الموظف باستخدام معرفه
            employe = Employe.objects.filter(id=employee_id).first()

            if not employe:
                return JsonResponse({"error": "❌ الموظف غير موجود!"}, status=404)

            # إنشاء التقييم
            evaluation = Evaluation.objects.create(
                employe=employe,
                note=note,
                commentaire=commentaire,
                category=category,
                user=request.user,
            )

            return JsonResponse({
                "id": evaluation.id,
                "added_by": request.user.full_name or request.user.username,
                "employee_full_name": f"{employe.utilisateur.nom} {employe.utilisateur.prenom}",
                "category": evaluation.category
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "❌ البيانات المرسلة غير صحيحة"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"❌ خطأ غير متوقع: {str(e)}"}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)




@csrf_exempt
def transfer_employee(request, employee_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_dept = data.get('department')
        new_post = data.get('post')

        # التحقق من البيانات المدخلة
        if not new_dept or not new_post:
            return JsonResponse({'error': 'Both department and post are required'}, status=400)

        try:
            employe = Employe.objects.get(id=employee_id)
            employe.departement = new_dept
            employe.poste = new_post
            employe.save()
            return JsonResponse({'success': True})
        except Employe.DoesNotExist:
            return JsonResponse({'error': 'Employee not found'}, status=404)

    return JsonResponse({'error': 'Invalid request'}, status=400)

def employee_list(request):

    search_query = request.GET.get('q', '')  # On récupère la recherche (optionnelle)

    if search_query:
        employees = Employee.objects.filter(name__icontains=search_query)
    else:
        employees = Employee.objects.all()

    data = [
        {
            'id': emp.id,
            'name': emp.name,
            'position': emp.position,
            'department': emp.department,
            'hireDate': emp.hire_date.strftime('%Y-%m-%d'),
            'status': emp.status,
        }
        for emp in employees
    ]
    return JsonResponse(data, safe=False)

@csrf_protect
def contract_create(request):
    if request.method == 'POST':
        try:
            # استلام البيانات من الطلب
            employee_id = request.POST.get('employe')
            type_contrat = request.POST.get('type_contrat')
            start_date_str = request.POST.get('date_debut')
            end_date_str = request.POST.get('date_fin') or None
            salary = request.POST.get('salaire')
            status = request.POST.get('statut_contrat')

            print(f"📄 إنشاء العقد بـ: {employee_id}, {type_contrat}, {start_date_str}, {end_date_str}, {salary}, {status}")

            employe = Employe.objects.get(id=employee_id)

            # تحويل التواريخ من string إلى datetime.date
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date() if end_date_str else None

            # إنشاء العقد
            contrat = Contrat.objects.create(
                employe=employe,
                type_contrat=type_contrat,
                date_debut=start_date,
                date_fin=end_date,
                salaire=salary,
                statut_contrat=status
            )

            # رفع الوثيقة إن وجدت
            if 'document' in request.FILES:
                contrat.document = request.FILES['document']
                contrat.save()
                print("📎 تم رفع الوثيقة!")

            return JsonResponse({
                'id': contrat.id,
                'employee': str(contrat.employe),
                'type': contrat.type_contrat,
                'startDate': str(contrat.date_debut),
                'endDate': str(contrat.date_fin) if contrat.date_fin else '',
                'salary': str(contrat.salaire),
                'status': contrat.statut_contrat,
                'document': contrat.document.url if contrat.document else None,
                'isNearEnd': bool(contrat.date_fin and (contrat.date_fin - timezone.now().date()).days <= 30)
            }, status=201)

        except Employe.DoesNotExist:
            print("❌ الموظف غير موجود في قاعدة البيانات.")
            return JsonResponse({'message': '❌ الموظف غير موجود'}, status=404)

        except Exception as e:
            print(f"🧨 استثناء غير متوقع: {str(e)}")
            return JsonResponse({'message': f'❌ حدث خطأ: {str(e)}'}, status=500)

    return JsonResponse({'message': '❌ طريقة غير مسموحة'}, status=405)

def contract_list(request):
    contrats = Contrat.objects.select_related('employe__utilisateur').all()
    data = []
    for contrat in contrats:
        data.append({
            'id': contrat.id,
            'employee': contrat.employe.utilisateur.nom,
            'type': contrat.type_contrat,
            'startDate': contrat.date_debut.strftime('%Y-%m-%d'),
            'endDate': contrat.date_fin.strftime('%Y-%m-%d') if contrat.date_fin else '',
            'salary': str(contrat.salaire),
            'status': contrat.statut_contrat,
            'document': contrat.document.url if contrat.document else None,
            'isNearEnd': contrat.est_pres_de_fin,  # هل اقترب العقد من الانتهاء؟
        })
    return JsonResponse(data, safe=False)

User = get_user_model()

@require_GET
def get_user_by_email_or_id(request):
    email = request.GET.get('email')
    user_id = request.GET.get('id')

    if not email and not user_id:
        return JsonResponse({'error': 'Email or ID is required'}, status=400)

    try:
        if email:
            user = User.objects.get(email=email)
        elif user_id:
            user = User.objects.get(id=user_id)
        
        return JsonResponse({
            'first_name': user.first_name,
            'last_name': user.last_name,
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def contract_detail(request, id):
    contract = get_object_or_404(Contrat, id=id)

    if request.method == 'GET':
        data = {
            'employee': contract.employe.utilisateur.nom,
            'type': contract.type_contrat,
            'startDate': contract.date_debut.strftime('%Y-%m-%d'),
            'endDate': contract.date_fin.strftime('%Y-%m-%d') if contract.date_fin else '',
            'salary': str(contract.salaire),
            'status': contract.statut_contrat,
            'document': contract.document.url if contract.document else None,
            'isNearEnd': contract.est_pres_de_fin,
        }
        return JsonResponse(data)

    elif request.method in ['PUT', 'PATCH']:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'message': '❌ البيانات المرسلة غير صالحة'}, status=400)

        updated = False

        if 'salary' in data:
            contract.salaire = data['salary']
            updated = True

        if 'type' in data:
            contract.type_contrat = data['type']
            updated = True

        if 'startDate' in data:
            try:
                contract.date_debut = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
                updated = True
            except ValueError:
                return JsonResponse({'message': '❌ تنسيق تاريخ البداية غير صالح'}, status=400)

        if 'endDate' in data:
            if data['endDate']:
                try:
                    contract.date_fin = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
                    updated = True
                except ValueError:
                    return JsonResponse({'message': '❌ تنسيق تاريخ النهاية غير صالح'}, status=400)
            else:
                contract.date_fin = None
                updated = True

        if 'status' in data:
            contract.statut_contrat = data['status']
            updated = True

        if updated:
            contract.save()
            return JsonResponse({'message': '✅ تم تحديث العقد بنجاح!'})
        else:
            return JsonResponse({'message': '⚠️ لا توجد بيانات لتحديثها!'}, status=400)

    elif request.method == 'DELETE':
        contract.delete()
        return JsonResponse({'message': '🗑️ تم حذف العقد بنجاح!'}, status=204)

    return JsonResponse({'message': '❌ طريقة غير مدعومة'}, status=405)

@csrf_exempt
def update_evaluation(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            print("📥 Données reçues:", data)

            # تأكد من وجود التقييم
            evaluation = Evaluation.objects.get(pk=id)

            # تحقق من القيم المدخلة والتأكد من أنها صالحة
            note = int(data.get('note', 0))
            commentaire = data.get('commentaire', '')
            category = data.get('category', '')

            if not (note and commentaire and category):
                return JsonResponse({'error': 'البيانات المدخلة غير مكتملة'}, status=400)

            # تحديث التقييم
            evaluation.note = note
            evaluation.commentaire = commentaire
            evaluation.category = category

            evaluation.save()
            return JsonResponse({'success': True})

        except Evaluation.DoesNotExist:
            return JsonResponse({'error': 'التقييم غير موجود'}, status=404)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': f'خطأ داخلي: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'الطريقة غير مسموحة'}, status=405)

@csrf_exempt
def evaluation_list(request):
    try:
        evaluations = Evaluation.objects.select_related('employe__utilisateur', 'user').all()

        search_value = request.GET.get('q', '').lower()
        if search_value:
            evaluations = evaluations.filter(
                employe__utilisateur__nom__icontains=search_value
            )

        if not evaluations.exists():
            return JsonResponse({'message': '❌ لا توجد تقييمات مطابقة لبحثك'}, status=200)

        data = []
        for evaluation in evaluations:
            data.append({
                'id': evaluation.id,
                'employee': f"{evaluation.employe.utilisateur.nom} {evaluation.employe.utilisateur.prenom}",
                'score': evaluation.note,
                'date': evaluation.date_evaluation.strftime('%Y-%m-%d'),
                'comment': evaluation.commentaire,
                'category': evaluation.category,
                'user': f"{evaluation.user.nom} {evaluation.user.prenom}" if hasattr(evaluation.user, 'nom') else "Unknown"
            })

        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': f'خطأ في الخادم: {str(e)}'}, status=500)




@csrf_exempt
def delete_evaluation(request, id):
    if request.method == 'DELETE':
        try:
            # تحقق من وجود التقييم
            evaluation = get_object_or_404(Evaluation, id=id)
            evaluation.delete()
            return JsonResponse({'success': True})
        except Evaluation.DoesNotExist:
            return JsonResponse({'error': 'التقييم غير موجود'}, status=404)
    return JsonResponse({'error': 'الطريقة غير مسموحة'}, status=405)


@csrf_exempt
def get_recruitment_jobs(request):
    if request.method == 'GET':
        jobs = Recrutement.objects.all().order_by('-date_creation')
        jobs_data = [
            {
                'id': job.id,
                'title': job.poste,
                'description': job.description,
                'status': job.statut,
                'creationDate': job.date_creation.strftime('%Y-%m-%d')
            }
            for job in jobs
        ]
        return JsonResponse({'jobs': jobs_data})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_job = Recrutement.objects.create(
                poste=data.get('title'),
                description=data.get('description'),
                statut=data.get('status'),
                date_creation=timezone.now()
            )
            return JsonResponse({'message': '✅ Job added successfully', 'id': new_job.id})
        except Exception as e:
            return JsonResponse({'error': f'❌ Failed to add job: {str(e)}'}, status=400)

    else:
        return JsonResponse({'error': '⛔ Méthode non autorisée'}, status=405)


@csrf_exempt
def delete_job(request, id):
    if request.method == 'DELETE':
        job = get_object_or_404(Recrutement, id=id)
        job.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def update_job(request, id):
    if request.method == 'PUT':
        try:
            job = Recrutement.objects.get(id=id)
        except Recrutement.DoesNotExist:
            return JsonResponse({'error': '❌ وظيفة غير موجودة!'}, status=404)

        try:
            data = json.loads(request.body.decode('utf-8'))
            job.poste = data.get('title', job.poste)
            job.description = data.get('description', job.description)
            job.statut = data.get('status', job.statut)
            job.save()
            return JsonResponse({'success': True, 'message': '✅ تم التحديث بنجاح'})
        except Exception as e:
            return JsonResponse({'error': f'❌ خطأ أثناء التحديث: {str(e)}'}, status=400)
    
    return JsonResponse({'error': '❌ Méthode non autorisée'}, status=405)

@csrf_exempt
def create_job(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            poste = data.get('poste')
            description = data.get('description')
            statut = data.get('statut', 'ouvert')

            # تحقق من الحقول المطلوبة
            if not poste or not description:
                return JsonResponse({'error': '❌ الحقول poste و description مطلوبة!'}, status=400)

            # إنشاء الوظيفة
            job = Recrutement.objects.create(
                poste=poste,
                description=description,
                statut=statut
            )

            return JsonResponse({
                'success': True,
                'message': '✅ تمت إضافة الوظيفة بنجاح!',
                'job_id': job.id
            })

        except json.JSONDecodeError:
            return JsonResponse({'error': '📛 بيانات JSON غير صالحة!'}, status=400)

    return JsonResponse({'error': '🚫 الميثود غير مدعومة'}, status=405)

 
  #view.py #nourcreate-account
@csrf_exempt
def search_recruitment_jobs(request):
    if request.method == 'GET':
        query = request.GET.get('q', '').strip().lower()

        if query:
            jobs = Recrutement.objects.filter(poste__icontains=query)
        else:
            jobs = Recrutement.objects.all()

        jobs_data = [
            {
                'id': job.id,
                'title': job.poste,
                'description': job.description,
                'status': job.statut,
                'creationDate': job.date_creation.strftime('%Y-%m-%d')
            }
            for job in jobs
        ]

        if not query:
            # رجّع البيانات + رسالة أنه كان الحقل فاضي
            return JsonResponse({
                'message': '⚠️ الحقل فارغ، تم عرض كل النتائج.',
                'data': jobs_data
            })

        return JsonResponse(jobs_data, safe=False)

    return JsonResponse({'error': '🚫 ميثود غير مدعومة'}, status=405)



# views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Utilisateur, Role
from django.contrib.auth.hashers import make_password
from django.utils import timezone

def signup(request):
    if request.method == 'POST':
        nom = request.POST.get('nom')
        prenom = request.POST.get('prenom')
        email = request.POST.get('email')
        mot_de_passe = request.POST.get('mot_de_passe')
        role_name = request.POST.get('role')

        # التحقق مما إذا كان المستخدم موجودًا مسبقًا
        if Utilisateur.objects.filter(email=email).exists():
            messages.error(request, 'Email address already in use.')
            return redirect('signup')

        try:
            # التحقق من وجود الدور
            role = Role.objects.get(nom_role=role_name)
        except Role.DoesNotExist:
            messages.error(request, 'Invalid role.')
            return redirect('signup')

        # إنشاء المستخدم
        utilisateur = Utilisateur.objects.create(
            nom=nom,
            prenom=prenom,
            email=email,
            mot_de_passe=make_password(mot_de_passe),
            role=role,
            date_creation=timezone.now(),
            statut="en_attente"
        )

        messages.success(request, 'The request was created successfully. Pending validation.')
        return redirect('login')

    return render(request, 'myapp/create-account.html')



#nour 

#admin 
from django.shortcuts import render, redirect, get_object_or_404
from .models import Utilisateur
from django.contrib import messages
from django.db.models import Count
from django.db.models.functions import TruncDate
import json
from django.shortcuts import render
@csrf_exempt
def admin_dashboard(request):
    # المستخدمين قيد الانتظار
    pending_users = Utilisateur.objects.filter(statut='en_attente')
    pending_count = pending_users.count()
    all_users = Utilisateur.objects.all()
    # المستخدمين المقبولين
    accepted_count = Utilisateur.objects.filter(statut='accepte').count()

    # إجمالي المستخدمين
    total_users = Utilisateur.objects.filter(statut='accepte').count()


    # حساب النسب
    if total_users > 0:
        pending_percentage = (pending_count / total_users) * 100
        accepted_percentage = (accepted_count / total_users) * 100
    else:
        pending_percentage = accepted_percentage = 0

    # بيانات الموظفين
    employee_count = Utilisateur.objects.filter(role__nom_role='Employee').count()
    drh_count = Utilisateur.objects.filter(role__nom_role='drh').count()

    # عدد المستخدمين حسب الأيام
    user_by_day_qs = Utilisateur.objects.annotate(date_only=TruncDate('date_creation')) \
                                        .values('date_only') \
                                        .annotate(count=Count('id')) \
                                        .order_by('date_only')
    user_by_day = {str(entry['date_only']): entry['count'] for entry in user_by_day_qs}

    context = {
        'pending_users': pending_users,  # للجدول
        'pending_count': pending_count,  # للإحصائيات
        'accepted_count': accepted_count,
        'employee_count': employee_count,
        'admin_count': drh_count,
        'total_users': total_users,
        'user_by_day': json.dumps(user_by_day),
        'all_users': all_users,
        # تمرير النسب للرسم الدائري
        'pending_percentage': pending_percentage,
        'accepted_percentage': accepted_percentage,
    }

    return render(request, 'myapp/admin.html', context)

from django.shortcuts import render, redirect, get_object_or_404
from .models import Utilisateur
from django.http import HttpResponse
def users_view(request):
    users = Utilisateur.objects.all()  # استرجاع جميع المستخدمين من قاعدة البيانات
    return render(request, 'users.html', {'users': users})

# عرض الطلبات المعلقة
def pending_requests(request):
    pending_users = Utilisateur.objects.filter(etat_demande='en_attente')  # استعلام للمستخدمين الذين في حالة "معلق"
    return render(request, 'myapp/admin.html', {'pending_users': pending_users})

from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from .models import Utilisateur
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.http import JsonResponse

@csrf_exempt
def update_statut(request, user_id):
    user = get_object_or_404(Utilisateur, id=user_id)

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'accept':
            user.etat_demande = 'accepte'
            user.save()
            messages.success(request, f"{user.nom} accepted successfully.")
            print("تم قبول المستخدم:", user.nom)
            return redirect('admin_dashboard')
        elif action == 'reject':
            user.delete()
            messages.error(request, f"{user.nom} was rejected and deleted.")
            return redirect('admin_dashboard')
            return JsonResponse({'status': 'success', 'message': 'Statut updated successfully'})

    return HttpResponse(status=400)
from django.shortcuts import render, get_object_or_404, redirect
from .models import Utilisateur

from django.shortcuts import get_object_or_404, redirect
from .models import Utilisateur  # أو حسب اسم النموذج

def edit_user(request, user_id):
    user = get_object_or_404(Utilisateur, id=user_id)

    if request.method == 'POST':
        field = request.POST.get('field_to_edit')
        new_value = request.POST.get('new_value')

        if field and new_value:
            setattr(user, field, new_value)
            user.save()
            return redirect('admin_dashboard')  # غيريها لاسم الصفحة المناسبة عندك

    return redirect('admin_dashboard')

# === حذف المستخدم ===

def delete_user(request, user_id):
    user = get_object_or_404(Utilisateur, id=user_id)

    if request.method == 'POST':
        user.delete()
        return redirect('admin_dashboard')  # استخدمي الاسم بدلًا من الرابط الصريح

    return HttpResponse(status=405)  # Method Not Allowed لو أحد حاول يرسل GET
# في ملف views.py


def add_admin(request):
    if request.method == 'POST':
        # الحصول على البيانات من النموذج
        nom = request.POST['nom']
        prenom = request.POST['prenom']
        email = request.POST['email']
        mot_de_passe = request.POST['mot_de_passe']

        # البحث عن دور "Admin" في قاعدة البيانات
        role_admin = Role.objects.get(nom_role="Admin")

        # إنشاء المستخدم الجديد
        user = Utilisateur.objects.create_user(
            email=email,
            username=email,  # يمكن استخدام البريد الإلكتروني كاسم مستخدم
            mot_de_passe=mot_de_passe,
            nom=nom,
            prenom=prenom,
            role=role_admin,
            statut='accepte'  # تعيين الحالة إلى 'قبول'
        )
        
        # يمكنك تعيين المستخدم كمسؤول في Django إذا رغبت
        user.is_staff = True
        user.is_superuser = True
        user.save()

        return redirect('admin_dashboard')  # أو الصفحة التي تريد إعادة التوجيه إليها بعد إضافة المسؤول
    return render(request, 'admin.html') 


  # قم بتعديل مسار الملف بناءً على هيكل مشروعك
from django.http import HttpResponseRedirect
def accept_user(request, user_id):
    # التأكد من أن المستخدم موجود في قاعدة البيانات
    user = get_object_or_404(Utilisateur, id=user_id)

    if request.method == 'POST':
        # تحديث حالة المستخدم إلى "accepte"
        user.statut = 'accepte'
        user.save()  # حفظ التغييرات في قاعدة البيانات

    # بعد التحديث، إعادة توجيه المستخدم إلى صفحة أخرى (مثل صفحة التنبيهات)
    return HttpResponseRedirect(request.META.get('HTTP_REFERER')) # استبدل 'notifications' بالـ URL المناسب


#party chimoume
#affiche information
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def profile_view(request):
    user = request.user
    context = {
        'user': user,
    }
    return render(request,'DRH.html', context)


#upate profile
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from .models import Utilisateur
import json

@login_required
def profile_settings(request):
    user = request.user

    if request.method == "GET":
        return render(request, 'myapp/DRH.html', {'user': user})

    elif request.method == "POST":
        data = json.loads(request.body)

        full_name = data.get('fullName')
        username = data.get('username')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match!'}, status=400)

        try:
            user.nom = full_name.split()[0]
            user.prenom = ' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
            user.username = username
            user.email = email
            user.telephone = phone

            if password:
                user.set_password(password)

            user.save()

            return JsonResponse({'success': 'Profile updated successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


#barchar stat recupirer
from django.shortcuts import render
from .models import Employe, Candidature, Conge  # تأكد أنك تستخدم Conge بدل Absence
from django.http import JsonResponse

def dashboard_api(request):
    total_employes = Employe.objects.count()
    total_candidats = Candidature.objects.count()
    total_absences = Conge.objects.count()

    return JsonResponse({
        'total_employes': total_employes,
        'total_candidats': total_candidats,
        'total_absences': total_absences
    })

    return render(request, 'myapp/DRH.html', context)
from django.shortcuts import render
from django.http import JsonResponse
from .models import Employe, Candidature, Absence
from django.db.models import Count
from django.utils import timezone
from django.db.models.functions import ExtractWeekDay

def dashboard_data(request):
    total_employes = Employe.objects.count()
    total_candidats = Candidature.objects.count()
    total_absences = Absence.objects.count()

    # ✅ Use the correct field name: date_debut
    absences_by_day = Absence.objects.annotate(
        weekday=ExtractWeekDay('date_debut')
    ).values('weekday').annotate(count=Count('id'))

    daily_absences = [0] * 7
    for a in absences_by_day:
        index = (a['weekday'] - 1) % 7  # Sunday = 0
        daily_absences[index] = a['count']

    return JsonResponse({
        'total_employes': total_employes,
        'total_candidats': total_candidats,
        'total_absences': total_absences,
        'daily_absences': daily_absences  # ✅ Now will appear!
    })
from django.http import JsonResponse
from .models import Employe
from django.db.models import Count

def employees_by_department(request):
    employees_by_dept = Employe.objects.values('departement').annotate(count=Count('id'))
    return JsonResponse({'departements': list(employees_by_dept)})

#payrool
from decimal import Decimal
from .models import BulletinPaie, Employe, Utilisateur
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

def get_all_payrolls(request):
    bulletins = BulletinPaie.objects.select_related("employe__utilisateur").all()

    current_month = datetime.now().month

    data = []
    for b in bulletins:
        net = b.montant_net
        gross = net * Decimal("1.2")
        deductions = gross - net

        # Convert b.mois to int if it's a string or check however it's stored (e.g., "April" -> 4)
        if isinstance(b.mois, str):  # If stored as "April", "May", etc.
            try:
                mois_num = datetime.strptime(b.mois, "%B").month
            except ValueError:
                mois_num = current_month  # fallback
        else:
            mois_num = b.mois  # assuming it's int

        # Reset if the month is not the current one and status is still "Paid"
        if b.status_pyment == "Paid" and mois_num != current_month:
            b.status_pyment = "Not Paid"
            b.save()

        data.append({
            "id": b.id,
            "name": f"{b.employe.utilisateur.nom} {b.employe.utilisateur.prenom}",
            "month": b.mois,
            "gross": float(gross),
            "deductions": float(deductions),
            "net": float(net),
            "status_pyment": b.status_pyment,
        })

    return JsonResponse(data, safe=False)

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

@csrf_exempt
@require_POST
def update_payment_status(request):
    try:
        data = json.loads(request.body)
        ids = data.get("ids", [])

        if not ids:
            return JsonResponse({"error": "No IDs provided"}, status=400)

        BulletinPaie.objects.filter(id__in=ids).update(status_pyment="Paid")
        return JsonResponse({"success": True, "updated_ids": ids})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
from django.http import JsonResponse, Http404
from .models import BulletinPaie

def get_single_payroll(request, payroll_id):
    try:
        bulletin = BulletinPaie.objects.get(id=payroll_id)
        return JsonResponse({
            "id": bulletin.id,
            "employee": str(bulletin.employe),
            "mois": bulletin.mois,
            "annee": bulletin.annee,
            "montant_net": float(bulletin.montant_net),
            "status_pyment": bulletin.status_pyment,
            "fichier_pdf": bulletin.fichier_pdf,
        })
    except BulletinPaie.DoesNotExist:
        raise Http404("Payslip not found")

  # employer conger demande 
from django.http import JsonResponse
from .models import Conge
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

@csrf_exempt
def get_leave_requests(request):
    delete_expired_leaves()
    today = timezone.now().date()
    
    # Récupérer les demandes acceptées ou en attente et dont la date_fin n'est pas passée
    conges = Conge.objects.select_related('employe__utilisateur').filter(
        statut__in=['accepté', 'en attente'],  # Ajouter 'en attente' pour inclure les demandes non traitées
        date_fin__gte=today
    )
    
    data = []
    for conge in conges:
        data.append({
            "id": conge.id,
            "name": conge.employe.utilisateur.nom,
            "start": conge.date_debut.strftime("%Y-%m-%d"),
            "end": conge.date_fin.strftime("%Y-%m-%d"),
            "reason": conge.raison,
            "status": conge.statut,
        })

    return JsonResponse(data, safe=False)
#update status leave
from django.views.decorators.http import require_POST
import json
import logging
logger = logging.getLogger(__name__)
@csrf_exempt
@require_POST
def update_leave_status(request, conge_id):
    try:
        data = json.loads(request.body)
        statut = data.get("statut")

        conge = Conge.objects.get(id=conge_id)
        conge.statut = statut
        conge.save()

        return JsonResponse({"success": True, "message": "Status updated."})
    except Conge.DoesNotExist:
        logger.error(f"Leave request with ID {conge_id} not found")
        return JsonResponse({"success": False, "message": "Leave not found"}, status=404)
    except Exception as e:
        logger.error(f"Error updating leave status: {str(e)}")
        return JsonResponse({"success": False, "message": str(e)}, status=500)
from django.utils import timezone
from .models import Conge
def delete_expired_leaves():
    today = timezone.now().date()
    # Supprimer les congés acceptés dont la date de fin est passée
    Conge.objects.filter(statut='accepté', date_fin__lt=today).delete()


    
# views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Employe, Utilisateur
from django.http import JsonResponse

@login_required
def dashboard_data_emp(request):
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
        # Maybe the user is Admin (not employee)
        data = {
            'full_name': user.full_name,
            'poste': 'Administrator',
            'email': user.email,
            'employee_id': user.id,
            'departement': 'Administration',
            'date_embauche': user.date_creation.strftime('%B %d, %Y'),
            
        }

    return JsonResponse(data)
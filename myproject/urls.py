from django.urls import path
from myapp import views  # ✅ هذا الصح
from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('', include('myapp.urls')),  # 🟢 هذا ضروري جداً!
    path('admin/', admin.site.urls),
    path('posts/', views.post_list, name='post_list'),
]

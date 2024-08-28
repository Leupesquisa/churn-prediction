# churn_prediction_backend/urls.py (ou outro nome do projeto)

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Verifique se 'api' está incluído aqui
]

from django.urls import path
from Users import views 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns=[
    path('account', views.AccountAPI),
    path('Login', views.Login),
    path('Logout', views.Logout),
    path('Post', views.Post),
    path("Details", views.Details),
    path('Tags', views.Tags),
    path("Comments", views.Comments)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
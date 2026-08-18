from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from quickstart import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)


auth_urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("me/", views.MeView.as_view(), name="me"),
]

item_urlpatterns = [
    path("items/", views.ItemListCreateView.as_view(), name="item-list-create"),
    path("items/<int:pk>/", views.ItemRetrieveUpdateDestroyView.as_view(), name="item-retrieve-update-destroy"),
]

character_urlpatterns = [
    path("characters/", views.CharacterListView.as_view(), name="character-list"),
    path("characters/<int:pk>/", views.CharacterDetailView.as_view(), name="character-detail"),
]
urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include(auth_urlpatterns)),
    path("api/", include(item_urlpatterns)),
    path("api/", include(character_urlpatterns)),
    path("api/stats/", views.StatsView.as_view(), name="stats"),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]



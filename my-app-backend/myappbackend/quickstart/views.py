from django.contrib.auth.models import Group, User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Item
from .serializers import ItemSerializer


from quickstart.serializers import (
    GroupSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class ItemListCreateView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            RefreshToken(request.data["refresh"]).blacklist()
        except KeyError:
            return Response(
                {"detail": "A refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        )
    

class StatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_items = Item.objects.count()
        return Response(
            {
                "total_users": total_users,
                "total_items": total_items,
            }
        )
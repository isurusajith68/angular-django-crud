from django.contrib.auth.models import Group, User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Item

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
        }
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    # confirmPassword = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        return value

    # def validate(self, attrs):
    #     if attrs["password"] != attrs["confirmPassword"]:
    #         raise serializers.ValidationError(
    #             {"confirmPassword": "Passwords do not match."}
    #         )
    #     return attrs

    def create(self, validated_data):
        # validated_data.pop("confirmPassword")
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "description", "quantity", "price", "created_at", "updated_at"]

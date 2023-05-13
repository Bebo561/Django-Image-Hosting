from rest_framework import serializers
from Users.models import Accounts, Images, Coms
from django.contrib.auth.hashers import make_password

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model=Accounts
        fields=('Username', 'Password', 'Security_Question', 'Answer')

    def create(self, validated_data):
        Account = Accounts.objects.create(
            Username=validated_data['Username'],
            Password = make_password(validated_data['Password']),
            Security_Question=validated_data['Security_Question'],
            Answer=validated_data['Answer']
        )
        return Account

class ImageSerializer(serializers.ModelSerializer):
    Image = serializers.ImageField(required=False)

    class Meta:
        model =Images
        fields=('Title', 'Poster', 'Image', 'Tags')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coms
        fields = ('Image_id', 'Poster', 'Details', 'Likes', 'User')

    
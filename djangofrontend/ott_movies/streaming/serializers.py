from rest_framework import serializers
from .models import Movies
from .models import WatchLater
from .models import WatchHistory 
from .models import MovieComment  


class MovieSerializer(serializers.ModelSerializer):
    views = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = Movies
        fields = '__all__'


class WatchLaterSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True) 
    
    class Meta:
        model = WatchLater
        fields = "__all__"

class WatchHistorySerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True) 

    class Meta:
        model = WatchHistory
        fields = "__all__"

class MovieCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)
    rating = serializers.IntegerField(read_only=True)  # if rating exists

    class Meta:
        model = MovieComment
        fields = ["id", "user_name", "comment", "rating", "created_at"]


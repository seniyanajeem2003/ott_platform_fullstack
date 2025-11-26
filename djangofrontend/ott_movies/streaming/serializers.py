from rest_framework import serializers
from .models import Movies
from .models import WatchLater
from .models import WatchHistory    

class MovieSerializer(serializers.ModelSerializer):
    views = serializers.IntegerField(read_only=True)
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

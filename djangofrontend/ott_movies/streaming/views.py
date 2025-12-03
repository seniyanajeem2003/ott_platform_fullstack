from django.shortcuts import render,redirect, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate,login
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK
from .serializers import (MovieSerializer,WatchLaterSerializer,WatchHistorySerializer, MovieCommentSerializer)
from .models import Movies
from .models import WatchLater
from .models import WatchHistory
from .models import MovieComment
from rest_framework import status  
from rest_framework.permissions import IsAuthenticated 
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .models import WatchHistory,User
from django.db.models import Q
from django.db.models import Count
from django.contrib.auth import logout
from django.contrib import messages





def admin_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if getattr(user, 'is_admin', False) == True:
                login(request, user)
                return redirect("home")  
            else:
                messages.error(request, "Access denied. You are not an admin.")
        else:
            messages.error(request, "Invalid email or password")

    return render(request, "login.html")


@login_required
def home(request):
    query = request.GET.get("q", "")
    
    movies = Movies.objects.all()
    
    if query:
        movies = movies.filter(title__icontains=query)
   
    paginator = Paginator(movies, 5)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    
    return render(request, "home.html", {
        "page_obj": page_obj,
        "query": query,
    })




@login_required
def search_movies(request):
    query = request.GET.get("q", "").strip()
    if query:
        movies = Movies.objects.filter(title__icontains=query).order_by('id')
    else:
        movies = []

    data = [{"id": m.id, "title": m.title, "description": m.description} for m in movies]
    return JsonResponse({"movies": data})

@login_required
def search_users(request):
    query = request.GET.get("q", "").strip()
    if query:
        users = User.objects.filter(name__icontains=query).order_by('id')
    else:
        users = []

    results = []
    for user in users:
        status = "Active" if user.is_active else "Blocked"
        results.append({
            "id": user.id,
            "name": user.name,
            "status": status,
        })
    return JsonResponse({"results": results})

@login_required
def search_user_history(request):
    user_id = request.GET.get("user_id") 
    query = request.GET.get("q", "").strip()

    results = []
    if user_id and query:
        histories = WatchHistory.objects.filter(
            user_id=user_id,
            movie__title__icontains=query
        ).order_by('-watched_on')

        results = [
            {
                "movie_title": h.movie.title,
                "watched_on": h.watched_on.strftime("%d %b %Y")
            } for h in histories
        ]

    return JsonResponse({"results": results})



@login_required
def new_movie(request, id=None):
    movie = None

    if id:
        movie = get_object_or_404(Movies, id=id)

    if request.method == "POST":
        name = request.POST.get("name")
        desptn = request.POST.get("desptn")
        image = request.FILES.get("image")
        video_file = request.FILES.get("video_file")
        
        if movie:  
            movie.title = name
            movie.description = desptn
           

            if image:
                movie.image = image
            if video_file:
                movie.video_file = video_file

            movie.save()
            return redirect("home")

        else:    
            movie = Movies.objects.create(
                title=name,
                description=desptn,
                image=image,
                video_file=video_file,
            )
            return redirect("home")

    return render(request, 'new_movie.html', {
        'movie': movie,
    })



@login_required
def delete_movie(request, id):
    movie = get_object_or_404(Movies, id=id)
    movie.delete()
    return redirect("home")


@login_required
def view_movie(request, id):
    movie = get_object_or_404(Movies, id=id)
    return render(request, "view_movie.html", {"movie": movie})


@login_required
def user_data(request):
    q = request.GET.get("q")

    users = User.objects.filter(is_admin=False)

    if q:
        users = users.filter(
            Q(email__icontains=q) | Q(name__icontains=q)
        )
    
    users = users.order_by("id")

    paginator = Paginator(users, 5)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "user_data.html", {"page_obj": page_obj})


@login_required
def toggle_user_status(request, id):
    user = get_object_or_404(User, id=id)
    user.is_active = not user.is_active
    user.save()
    return redirect("data")


@login_required
def user_history(request, id):
    user = get_object_or_404(User, id=id)
    q = request.GET.get("q", "")

    history = WatchHistory.objects.filter(user=user)

    if q:
        history = history.filter(movie__movie_name__icontains=q)

    history = history.order_by("-watched_on")

    paginator = Paginator(history, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "user_history.html", {
        "user": user,
        "page_obj": page_obj
    })


@login_required
def view_count(request):
    q = request.GET.get("q", "")

    movies = Movies.objects.annotate(
        views=Count('watchhistory__user', distinct=True)
    )

    if q:
        movies = movies.filter(title__icontains=q)

    paginator = Paginator(movies.order_by("-views"), 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "view_count.html", {
        "page_obj": page_obj
    })



@login_required
def new_pswrd(request):
    if request.method == "POST":
        old_password = request.POST.get("old")
        new_password = request.POST.get("new")
        user = request.user

        if not user.check_password(old_password):
            messages.error(request, "Old password is incorrect")
            return redirect("new_pswrd") 

        user.set_password(new_password)
        user.save()
        messages.success(request, "Password changed successfully! Please log in again.")
        return redirect("login")

    return render(request, "new_pswrd.html")



@login_required
def admin_logout(request):
    logout(request)
    return redirect('login') 



#--------------------------------api views----------------------------------------#

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login_api(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if email is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=HTTP_200_OK)



@csrf_exempt
@api_view(["GET", "POST"])
@permission_classes((AllowAny,))
def movies(request):

    if request.method == "GET":
        movies = Movies.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([AllowAny])
def get_movie(request, movie_id):
    try:
        movie = Movies.objects.get(id=movie_id)
    except Movies.DoesNotExist:
        return Response(
            {"error": "Movie not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    user = request.user if request.user.is_authenticated else None

    if user:
        existing = WatchHistory.objects.filter(user=user, movie=movie).first()
        if not existing:
            WatchHistory.objects.create(user=user, movie=movie)

        duplicates = WatchHistory.objects.filter(user=user, movie=movie)[1:]
        if duplicates.exists():
            duplicates.delete()
            
    view_count = WatchHistory.objects.filter(movie=movie).count()

    
    serializer = MovieSerializer(movie)
    data = serializer.data
    data["view_count"] = view_count 

    return Response(data, status=status.HTTP_200_OK)
   

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    return Response({
        "id": user.id,
        "name": user.name,
        "email": user.email
    }, status=200)

   
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])

def add_watch_later(request):
    user = request.user
    movie_id = request.data.get("movie_id")

    if not movie_id:
        return Response({"error": "movie_id required"}, status=400)

    obj, created = WatchLater.objects.get_or_create(
        user=user,
        movie_id=movie_id
    )

    if not created:
        return Response({"message": "Already added"}, status=200)

    return Response(WatchLaterSerializer(obj).data, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watch_later(request):
    user = request.user
    items = WatchLater.objects.filter(user=user)
    serializer = WatchLaterSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_watch_later(request):
    user = request.user
    movie_id = request.data.get("movie_id")

    try:
        obj = WatchLater.objects.get(user=user, movie_id=movie_id)
        obj.delete()
        return Response({"message": "Removed"}, status=200)
    except WatchLater.DoesNotExist:
        return Response({"error": "Not found"}, status=404)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_watch_history(request):
    user = request.user
    movie_id = request.data.get("movie_id")

    if not movie_id:
        return Response({"error": "movie_id required"}, status=400)
    
    if WatchHistory.objects.filter(user=user, movie_id=movie_id).exists():
        return Response(
            {"message": "Movie already in watch history"},
            status=200
        )

    history = WatchHistory.objects.create(
        user=user,
        movie_id=movie_id
    )

    return Response(WatchHistorySerializer(history).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_history(request):
    user = request.user
    history = WatchHistory.objects.filter(user=user).order_by('-watched_on')
    serializer = WatchHistorySerializer(history, many=True)
    return Response(serializer.data)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response(
            {"error": "old_password and new_password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(old_password):
        return Response(
            {"error": "Old password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password changed successfully"},
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_comment(request):
    try:
        movie_id = request.data.get("movie")
        comment_text = request.data.get("comment")

        print("Incoming Data:", request.data)  

        if not movie_id or not comment_text:
            return Response(
                {"error": "Movie ID and comment are required"},
                status=400
            )

        try:
            movie = Movies.objects.get(id=movie_id)
        except Movies.DoesNotExist:
            return Response(
                {"error": "Movie not found"},
                status=404
            )

        comment = MovieComment.objects.create(
            user=request.user,
            movie=movie,
            comment=comment_text
        )

        serializer = MovieCommentSerializer(comment)
        return Response(serializer.data, status=201)

    except Exception as e:
        print("Comment Error:", str(e))
        return Response(
            {"error": "Server error"},
            status=500
        )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_comments(request, movie_id):
    comments = MovieComment.objects.filter(movie_id=movie_id).order_by("-created_at")
    serializer = MovieCommentSerializer(comments, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    user = request.user
    try:
        token = Token.objects.get(user=user)
        token.delete()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({"error": "Token not found"}, status=status.HTTP_400_BAD_REQUEST)

#----------------------signupapi----------------------------#

@api_view(['POST'])
@permission_classes((AllowAny,))
def Signup(request):
        email  = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name")
        if not name or not email or not password:
            return Response({'message':'All fields are required'})
        if User.objects.filter(email=email).exists():
            return  JsonResponse({'message':'Email already exist'})
        user = User.objects.create_user(email=email,password=password)
        user.name = name
        user.save()
        return JsonResponse({'message':'user created successsfully'} ,status = 200)
         
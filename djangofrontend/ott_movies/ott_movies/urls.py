from django.urls import path
from streaming import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.admin_login, name='login'),
    path('home', views.home, name='home'),
    path('add', views.new_movie, name='add'),
    path('pswrd', views.new_pswrd, name='new_pswrd'),
    path('user_data', views.user_data, name='data'),
    path('block_user/<int:id>/', views.toggle_user_status, name='block_user'),
    path('unblock_user/<int:id>/', views.toggle_user_status, name='unblock_user'),
    path('user_history/<int:id>', views.user_history, name='history'),
    path("toggle-status/<int:id>/", views.toggle_user_status, name="toggle_user_status"),
    path('views', views.view_count, name='views'),
    path('view_movie/<int:id>', views.view_movie, name='view_movie'),
    path('movie/edit/<int:id>', views.new_movie, name='edit_movie'),
    path('movie/delete/<int:id>', views.delete_movie, name='delete_movie'),
    path("search_movies/", views.search_movies, name="search_movies"),
    path('search_users/', views.search_users, name='search_users'),
    path('search_user_history/', views.search_user_history, name='search_user_history'),
    path("logout", views.admin_logout, name='admin_logout'),

    # User API URLs
    path('api/login', views.login_api, name='login_page'),
    path('api/movies', views.movies, name='movies'),
    path("api/get_movie/<int:movie_id>/", views.get_movie),
    path('api/user', views.get_user_details),
    path('api/changepassword', views.change_password),
    path('api/watchlater/add', views.add_watch_later),
    path('api/watchlater/list', views.get_watch_later),
    path('api/watchlater/remove', views.remove_watch_later),
    path('api/watchhistory/add', views.add_watch_history),
    path('api/watchhistory/list', views.get_user_history),
    path("api/comments/<int:movie_id>/", views.get_comments),
    path("api/comments/add", views.add_comment),
    path('api/logout', views.logout_api),
    path('api/signup', views.Signup, name='signup'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

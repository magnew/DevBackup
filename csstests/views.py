from django.contrib.auth.decorators import login_required
from appfx.decorators.render import render_to

@render_to('csstests:home.html')
@login_required
def home(request):
    return {
        "message": "Hello World from csstests!",
        "app_name": "csstests"
    }
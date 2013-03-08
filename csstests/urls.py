from django.conf.urls import patterns, include, url
from appfx.utility.views import render_template as render

urlpatterns = patterns('',
    url(r'^home/$', 'csstests.views.home', name='home'),
    url(r'^bs/$', render('csstests:bs.html'), name='bs'),  
    url(r'^spl/$', render('csstests:spl.html'), name='spl'),  
    url(r'^spl2/$', render('csstests:spl2.html'), name='spl2'),  
    url(r'^spl3/$', render('csstests:spl3.html'), name='spl3'),  
    url(r'^spl4/$', render('csstests:spl4.html'), name='spl4'),  
)

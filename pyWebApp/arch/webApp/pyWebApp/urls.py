from django.conf.urls import url

from . import views
from . import tables

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^/tenantReg', tables.tenant.getReg, name='tenantRegister'),
    url(r'^/tenantLog', tables.tenant.getLog, name='tenantLogin'),
    url(r'^/tenantEdit', tables.tenant.editTenant, name='tenantEdit')
]

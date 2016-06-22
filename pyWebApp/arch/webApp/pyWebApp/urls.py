from django.conf.urls import url

from . import views
from . import tables

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^/tenantReg', tables.tenant.getReg, name='tenantRegister'),
    url(r'^/tenantLog', tables.tenant.getLog, name='tenantLogin'),
    url(r'^/tenantEdit', tables.tenant.editTenant, name='tenantEdit'),
    url(r'^/getAllTenants', tables.tenant.getAllTenants, name='getAllTenants'),

    url(r'^/adminLog', tables.admin.adminLog, name='adminLog'),

    url(r'^/schemaReg', tables.schema.getReg, name='schemaReg'),
    url(r'^/searchSchema', tables.schema.searchSchema, name='searchSchema'),
    url(r'^/getTenantSchema', tables.schema.getTenantSchema, name='getTenantSchema'),
    url(r'^/getQueueSchemas', tables.schema.getQueueSchemas, name='getQueueSchemas'),
    url(r'^/dealSchema', tables.schema.dealSchema, name='dealSchema'),
    url(r'^/editSchema', tables.schema.editSchema, name='editSchema')
]

# Generated by Django 4.1.13 on 2024-08-19 22:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_customer_churn_delete_churn_delete_customer'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customer_churn',
            old_name='churn',
            new_name='Churn',
        ),
    ]
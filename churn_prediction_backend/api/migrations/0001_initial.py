# Generated by Django 4.1.13 on 2024-08-05 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Churn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customerID', models.CharField(max_length=255)),
                ('churn', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('customerID', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=10)),
                ('SeniorCitizen', models.BooleanField()),
                ('Partner', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], max_length=3)),
                ('Dependents', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], max_length=3)),
                ('tenure', models.IntegerField()),
                ('PhoneService', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], max_length=3)),
                ('MultipleLines', models.CharField(max_length=50)),
                ('InternetService', models.CharField(max_length=50)),
                ('OnlineSecurity', models.CharField(max_length=50)),
                ('OnlineBackup', models.CharField(max_length=50)),
                ('DeviceProtection', models.CharField(max_length=50)),
                ('TechSupport', models.CharField(max_length=50)),
                ('StreamingTV', models.CharField(max_length=50)),
                ('StreamingMovies', models.CharField(max_length=50)),
                ('Contract', models.CharField(max_length=50)),
                ('PaperlessBilling', models.CharField(choices=[('Yes', 'Yes'), ('No', 'No')], max_length=3)),
                ('PaymentMethod', models.CharField(max_length=255)),
                ('MonthlyCharges', models.FloatField()),
                ('TotalCharges', models.FloatField()),
            ],
        ),
    ]
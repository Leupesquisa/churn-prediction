from djongo import models

class Customer_Churn(models.Model):
    customerID = models.CharField(max_length=255, primary_key=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    SeniorCitizen = models.BooleanField()
    Partner = models.CharField(max_length=3, choices=[('Yes', 'Yes'), ('No', 'No')])
    Dependents = models.CharField(max_length=3, choices=[('Yes', 'Yes'), ('No', 'No')])
    tenure = models.IntegerField()
    PhoneService = models.CharField(max_length=3, choices=[('Yes', 'Yes'), ('No', 'No')])
    MultipleLines = models.CharField(max_length=50)
    InternetService = models.CharField(max_length=50)
    OnlineSecurity = models.CharField(max_length=50)
    OnlineBackup = models.CharField(max_length=50)
    DeviceProtection = models.CharField(max_length=50)
    TechSupport = models.CharField(max_length=50)
    StreamingTV = models.CharField(max_length=50)
    StreamingMovies = models.CharField(max_length=50)
    Contract = models.CharField(max_length=50)
    PaperlessBilling = models.CharField(max_length=3, choices=[('Yes', 'Yes'), ('No', 'No')])
    PaymentMethod = models.CharField(max_length=255)
    MonthlyCharges = models.FloatField()
    TotalCharges = models.FloatField()
    Churn = models.CharField(max_length=3, choices=[('Yes', 'Yes'), ('No', 'No')])

    def __str__(self):
        return self.customerID


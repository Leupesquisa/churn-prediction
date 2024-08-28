from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views.training_view import TrainModelView
from api.views.prediction_view import PredictView
from api.views.visualization_view import VisualizationView
from api.views.statistics_view import StatisticsView
from api.views.data_preprocessing_view import DataPreprocessingView
from api.views.churn_views import CustomerChurnViewSet, ChurnStatisticsView, RegisterView, CustomAuthToken, PredictChurnView,ROCCurveView, ConfusionMatrixView, TenureDistributionView, MonthlyChargesDistributionView, CohortAnalysisView, FeatureImportanceView

router = DefaultRouter()
router.register(r'customers', CustomerChurnViewSet)

urlpatterns =  [
    path('', include(router.urls)),
    path('churn-statistics/', ChurnStatisticsView.as_view(), name='churn-statistics'),
    path('auth/register/', RegisterView.as_view(), name='user-register'),
    path('auth/login/', CustomAuthToken.as_view(), name='token_obtain_pair'),
    path('predict-churn/', PredictChurnView.as_view(), name='predict-churn'),  
    path('roc-curve/', ROCCurveView.as_view(), name='roc-curve'),
    path('confusion-matrix/', ConfusionMatrixView.as_view(), name='confusion-matrix'),
    path('tenure-distribution/', TenureDistributionView.as_view(), name='tenure-distribution'),
    path('monthly-charges-distribution/', MonthlyChargesDistributionView.as_view(), name='monthly-charges-distribution'),
    path('cohort-analysis/', CohortAnalysisView.as_view(), name='cohort-analysis'),
    path('feature-importance/', FeatureImportanceView.as_view(), name='feature-importance'),
    path('train/', TrainModelView.as_view(), name='train-model'),
    path('predict/', PredictView.as_view(), name='predict'),
    path('visualize/', VisualizationView.as_view(), name='visualize-results'),
    path('statistics/', StatisticsView.as_view(), name='statistics-results'),
    path('preprocess/', DataPreprocessingView.as_view(), name='preprocess-data'),
]

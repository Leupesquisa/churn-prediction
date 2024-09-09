# Churn Prediction

This project aims to predict customer churn using machine learning. It includes a front-end built with React and a back-end built with Django, interfacing with a MongoDB database.The system is designed to predict the likelihood of customers canceling their services based on historical data and to display these predictions in a visually appealing way for users, such as data analysts or managers within a financial institution.

## Key Features
- Predict customer churn using machine learning models.
- Manage customer data and churn predictions through a RESTful API.
- Interactive dashboards for visualizing customer churn data.
- Authentication and authorization for secure data access.

## Cutting-edge Technologies

### Front-end
- **React**: For building a dynamic and responsive user interface.
- **Redux**: For state management.
- **Material-UI**: For component-based styling and design.

  [![Portfolio](https://github.com/Leupesquisa/Leupesquisa/blob/main/churnprediction.gif)](https://github.com/Leupesquisa/FullStack-Development)

### Back-end
- **Django**: For building a robust back-end with RESTful APIs.
- **Django REST Framework**: For easy API creation and management.

### Database
- **MongoDB**: For scalable and flexible NoSQL data storage.
- **djongo**: To integrate Django with MongoDB.


### Orchestration
- **Kubernetes**: For deploying and managing containerized applications at scale.

### Security
- **JWT**: For secure authentication and authorization.
- **HTTPS**: For secure data transmission (optional, if applicable).

### Model Performance - Recall Scores

| Model                    | Recall   |
|---------------------------|----------|
| Logistic Regression        | 0.764496 |
| Support Vector Machines    | 0.754897 |
| Random Forest              | 0.748465 |
| K-Nearest Neighbors        | 0.734080 |
| XGBoost                    | 0.732571 |
| Decision Tree              | 0.679410 |

## Data Source

The data used in this project was originally made available on the IBM Developer educational platform. This data represents a typical scenario in a telecommunications company. The complete dataset is accessible [here](https://raw.githubusercontent.com/Leupesquisa/churn-prediction/main/WA_Fn-UseC_-Telco-Customer-Churn.csv).


```bash
git clone https://github.com/leupesquisa/churn-prediction.git
cd churn-prediction


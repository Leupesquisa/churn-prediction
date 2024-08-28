# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# (core logic of the churn model, including training and prediction)

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import recall_score
from imblearn.under_sampling import RandomUnderSampler
from core.model_storage import save_model_to_mongodb, load_model_from_mongodb

class ChurnModel:
    def __init__(self, model_type='logistic_regression', load_existing=False):
        self.model_type = model_type
        if load_existing:
            self.model = load_model_from_mongodb(self.model_type)
        else:
            self.model = self._initialize_model()

    def _initialize_model(self):
        if self.model_type == 'logistic_regression':
            return LogisticRegression(random_state=42)
        elif self.model_type == 'knn':
            return KNeighborsClassifier()
        elif self.model_type == 'decision_tree':
            return DecisionTreeClassifier()
        elif self.model_type == 'random_forest':
            return RandomForestClassifier()
        elif self.model_type == 'svm':
            return SVC()
        else:
            raise ValueError("Unsupported model type: {}".format(self.model_type))

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)
        save_model_to_mongodb(self.model, self.model_type)

    def predict(self, X_test):
        return self.model.predict(X_test)


# Defina a função preprocess_data fora da classe ChurnModel
def preprocess_data(df):   

    print(f"Columns before dropping 'Churn': {df.columns.tolist()}")
    print(f"Churn column data type: {df['Churn'].dtype}")   
    
    X = df.drop('Churn', axis=1)  # Remove a coluna 'Churn' para criar o conjunto de features
    y = df['Churn']  # Define 'Churn' como a variável target
    
    return train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
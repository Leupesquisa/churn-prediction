# @author Leu A. Manuel
# @see https://github.com/Leupesquisa

from pymongo import MongoClient
from bson.binary import Binary
import joblib
import io

class ModelStorageService:
    def __init__(self, db_name='churn_prediction_db', collection_name='models'):
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def save_model(self, model, model_name):
        # Serialize the model using joblib and save to a file
        joblib.dump(model, f'{model_name}.pkl') 

        # Store the model in MongoDB 
        with open(f'{model_name}.pkl', 'rb') as f:
             model_data = {
            'model_name': model_name,
            'model_data': Binary(f.read())
             }
        # Replace the existing model or insert a new one
        self.collection.replace_one({'model_name': model_name}, model_data, upsert=True)

        

    def load_model(self, model_name):
        model_record = self.collection.find_one({'model_name': model_name})
        if model_record:
            return joblib.load(io.BytesIO(model_record['model_data']))
        else:
            raise ValueError(f"No model found with name '{model_name}'. Train a model first.")

    def close_connection(self):
        self.client.close()
        
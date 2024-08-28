# @author Leu A. Manuel
# @see https://github.com/Leupesquisa

from core.mongodb_service import ModelStorageService

def save_model_to_mongodb(model, model_name):
    service = ModelStorageService()
    service.save_model(model, model_name)
    service.close_connection()

def load_model_from_mongodb(model_name):
    service = ModelStorageService()
    model = service.load_model(model_name)   
    service.close_connection()
    return model

# @author Leu A. Manuel
# @see https://github.com/Leupesquisa
# (Logic to balance the data using RandomUnderSampler)

from imblearn.under_sampling import RandomUnderSampler

def apply_random_undersampler(X_train, y_train):
    rus = RandomUnderSampler(random_state=42, sampling_strategy="majority")
    X_under, y_under = rus.fit_resample(X_train, y_train)
    return X_under, y_under, y_train.shape[0], y_under.shape[0]

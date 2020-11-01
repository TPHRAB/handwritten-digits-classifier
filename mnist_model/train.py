import tensorflow as tf
import tensorflow.keras as keras
import numpy as np
import matplotlib.pyplot as plt
import collections
from initialize_system import initialize_system

def main():
    # initialize system
    initialize_system()

    # load data
    (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

    # rescale images
    x_train, x_test = x_train[..., np.newaxis]/255.0, x_test[..., np.newaxis]/255.0

    # drop contradictory answers
    mapping = collections.defaultdict(set)
    for x,y in zip(x_train, y_train):
        mapping[tuple(x.flatten())].add(y)
    
    x_train_precise = []
    y_train_precise = []
    for x in x_train:
        answers = mapping[tuple(x.flatten())]
        if len(answers) == 1:
            x_train_precise.append(x)
            y_train_precise.append(list(answers)[0])
    
    x_train_precise = np.array(x_train_precise)
    y_train_precise = np.array(y_train_precise)

    # build model    
    model = keras.Sequential()
    model.add(keras.layers.Conv2D(32, 3, activation='relu', input_shape=(28, 28, 1)))
    model.add(keras.layers.Conv2D(64, 3, activation='relu'))
    model.add(keras.layers.MaxPooling2D(pool_size=2))
    model.add(keras.layers.Flatten())
    model.add(keras.layers.Dense(128, activation='relu'))
    model.add(keras.layers.Dense(10, activation='softmax'))
    
    # create model
    model.compile(
        optimizer='adam',
        loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
        metrics=['sparse_categorical_accuracy']
    )

    # train model
    history = model.fit(
        x_train_precise, y_train_precise,
        batch_size=128,
        epochs=1,
        verbose=0,
        validation_split=0.2
    )

    result = model.evaluate(x_test, y_test)
    print(result)

    model.save('saved_model') 

if __name__ == '__main__':
    main()

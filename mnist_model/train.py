import tensorflow as tf
import tensorflow.keras as keras
import numpy as np
import matplotlib.pyplot as plt
import collections

def main():
    # load data
    (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

    # rescale images
    x_train, x_test = x_train[..., np.newaxis]/255.0, x_test[..., np.newaxis]/255.0
    x_train_small = tf.image.resize(x_train, (4, 4)).numpy()
    x_test_small = tf.image.resize(x_test, (4, 4)).numpy()

    # drop contradictory answers
    mapping = collections.defaultdict(set)
    for x,y in zip(x_train_small, y_train):
        mapping[tuple(x.flatten())].add(y)
    
    x_train_small = list()
    y_train = list()
    for x,answers in mapping.items():
        if len(answers) == 1:
            x_train_small.append(x)
            y_train.append(list(answers)[0])
    
    x_train_small = np.array(x_train_small)

    



if __name__ == '__main__':
    main()

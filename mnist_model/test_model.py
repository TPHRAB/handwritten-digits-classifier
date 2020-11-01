import tensorflow.keras as keras
import numpy as np
from initialize_system import initialize_system

def main():
    initialize_system()
    (train_images, train_labels), (test_images, test_labels) = keras.datasets.mnist.load_data()
    model = keras.models.load_model('saved_model')

    test_images = test_images[..., np.newaxis] / 255.0
    loss, accuracy = model.evaluate(test_images, test_labels)
    print('Model loss: {:.2f}, accuracy: {:5.2f}%'.format(loss, 100*accuracy))


if __name__ == '__main__':
    main()
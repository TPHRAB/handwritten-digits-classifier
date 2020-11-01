from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession

def initialize_system():
    config = ConfigProto()
    config.gpu_options.allow_growth = True
    session = InteractiveSession(config=config)
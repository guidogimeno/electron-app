import logging
import sys

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.DEBUG,
    format="[%(levelname)s][%(asctime)s]: %(message)s"
)

stream_handler = logging.StreamHandler(sys.stdout)
logger.addHandler(stream_handler)


def log_info(message):
    logger.info(message)


def log_error(message):
    logger.error(message)

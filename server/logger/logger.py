import logging

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO, 
    format="[%(levelname)s][%(asctime)s]: %(message)s"
)

def log_info(message):
    logger.info(message)

def log_error(message):
    logger.error(message)


from logger.logger import log_info


class MetricsUseCase:
    def __init__(self, db):
        self.db = db

    def track(self, data):
        log_info(f"aca llegue {data}")
        assert False, "rompio todo?"

    def search(self, offset, limit, params):
        assert False, "not implemented"

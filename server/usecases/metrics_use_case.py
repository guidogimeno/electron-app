
class MetricsUseCase:
    def __init__(self, db):
        self.db = db

    def track(self, metric):
        assert metric is not None, "metric is empty"
        self.db.save_metric(metric)

    def search(self, offset, limit, params):
        assert False, "not implemented"

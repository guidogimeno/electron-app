from server.server import Server
from logger.logger import log_info
from database.sqlite import MySqlite

if __name__ == "__main__":
    log_info("Connecting to DB...")
    db = MySqlite()

    log_info("Server starting...")
    server = Server(db)
    # TODO: meter el port a una variable de entorno
    server.run("localhost", 3000)

    db.close()

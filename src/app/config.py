"""Configurations for development and maintenance"""
LOG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "client": {
            "format": (
                "%(levelname)s (%(filename)s at %(lineno)d): %(message)s"
            )
        },
        "standard": {
            "format": (
                "%(levelname)s (%(funcName)s): %(message)s"
                "\n\t├─file: %(pathname)s"
                "\n\t╰─line: %(lineno)d"
            )
        },
        "debug": {
            "format": (
                "%(asctime)s %(levelname)s (at %(funcName)s "
                "in line %(lineno)d):"
                "\n\t├─file: %(pathname)s"
                "\n\t├─task name: %(taskName)s"
                "\n\t╰─message: %(message)s\n"
            ),
            "datefmt": "%y-%m-%d %H:%M:%S"
        }
    },
    "handlers": {
        "client": {
            "class": "logging.StreamHandler",
            "formatter": "client",
            "level": "DEBUG"
        },
        "standard": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG"
        },
        "debug": {
            "class": "logging.StreamHandler",
            "formatter": "debug",
            "level": "DEBUG"
        }
    },
    "loggers": {
        "": {"handlers": ["debug"], "level": "DEBUG"},
        "standard": {
            "handlers": ["standard"],
            "level": "DEBUG",
            "propagate": False,
        },
        "debugger": {
            "handlers": ["debug"],
            "level": "DEBUG",
            "propagate": False,
        },
        "account.views": {
            "handlers": ["debug"],
            "level": "DEBUG",
            "propagate": False
        }
    }
}

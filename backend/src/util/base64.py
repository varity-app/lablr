"""
Helper methods related to base64 encoding and decoding
"""

import base64
import binascii


def decode_b64string(enc: str) -> str:
    """Decode a base64 encoded string"""

    try:
        enc_bytes = enc.encode("utf-8")
        message_bytes = base64.b64decode(enc_bytes)
        message = message_bytes.decode("utf-8")
    except binascii.Error as error:
        raise ValueError from error

    return message

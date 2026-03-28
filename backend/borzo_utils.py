
import os
import logging
import time
from typing import Optional
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BORZO_API_URL   = os.getenv("BORZO_API_URL", "").rstrip("/")
BORZO_API_TOKEN = os.getenv("BORZO_API_TOKEN", "")
STORE_PHONE     = os.getenv("STORE_PHONE", "")
STORE_NAME      = os.getenv("STORE_NAME", "U.S Atelier")
STORE_ADDRESS   = os.getenv("STORE_ADDRESS", "")

_MAX_RETRIES    = 3
_BACKOFF_FACTOR = 1.5   # waits: 0 s, 1.5 s, 3 s
_TIMEOUT        = 30    # seconds per request

# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _get_headers() -> dict:
    if not BORZO_API_TOKEN:
        raise RuntimeError("BORZO_API_TOKEN is not configured")
    return {
        "X-DV-Auth-Token": BORZO_API_TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _make_session() -> requests.Session:
    """Return a requests Session with retry strategy and no ambient proxy."""
    session = requests.Session()
    session.trust_env = False
    session.proxies = {"http": None, "https": None}

    retry = Retry(
        total=_MAX_RETRIES,
        backoff_factor=_BACKOFF_FACTOR,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["POST"],
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def _post(endpoint: str, payload: dict) -> Optional[dict]:
    """
    Generic POST to Borzo API.
    Returns parsed JSON on 200, None on any error.
    Never raises — caller decides how to handle None.
    """
    if not BORZO_API_URL or not BORZO_API_TOKEN:
        logger.error("Borzo API not configured (missing URL or token)")
        return None

    url = f"{BORZO_API_URL}/{endpoint.lstrip('/')}"
    try:
        session = _make_session()
        resp = session.post(url, headers=_get_headers(), json=payload, timeout=_TIMEOUT)
    except requests.exceptions.Timeout:
        logger.error("borzo_timeout endpoint=%s", endpoint)
        return None
    except requests.exceptions.ConnectionError as exc:
        logger.error("borzo_connection_error endpoint=%s err=%s", endpoint, type(exc).__name__)
        return None
    except requests.exceptions.ProxyError as exc:
        logger.error("borzo_proxy_error endpoint=%s err=%s", endpoint, type(exc).__name__)
        return None
    except Exception as exc:
        logger.exception("borzo_unexpected_error endpoint=%s err=%s", endpoint, type(exc).__name__)
        return None

    if resp.status_code == 401:
        logger.error("borzo_auth_failed — check BORZO_API_TOKEN")
        return None
    if resp.status_code == 422:
        # Log body but truncate to avoid PII spill
        logger.error("borzo_validation_error endpoint=%s body_prefix=%.200s", endpoint, resp.text)
        return None
    if resp.status_code != 200:
        logger.error("borzo_http_error endpoint=%s status=%s", endpoint, resp.status_code)
        return None

    try:
        return resp.json()
    except ValueError:
        logger.error("borzo_invalid_json endpoint=%s", endpoint)
        return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def calculate_order_price(
    pickup_address: str,
    delivery_address: str,
    weight_kg: float = 1.0,
) -> Optional[float]:
    """
    Estimate the delivery fee between two addresses.

    Returns:
        float  — estimated fee in the account's currency, or
        None   — if the estimate cannot be obtained (log already written).
    """
    if not pickup_address or not delivery_address:
        logger.warning("calculate_order_price called with empty address(es)")
        return None

    payload = {
        "matter": "Apparel delivery estimate",
        "points": [
            {"address": pickup_address, "note": "Pickup"},
            {"address": delivery_address, "note": "Delivery"},
        ],
    }

    data = _post("calculate-order", payload)
    if data is None:
        return None

    price = data.get("order", {}).get("payment_amount")
    if price is None:
        logger.warning("borzo_calculate_price — payment_amount missing in response")
        return None

    logger.info("borzo_price_estimated amount=%s", price)
    return float(price)


def validate_address(address: str) -> bool:
    """
    Ask Borzo whether an address string is serviceable.

    Returns True only when the API explicitly confirms validity.
    Fails closed (returns False) on any error.
    """
    if not address or not address.strip():
        return False

    data = _post("validate-address", {"address": address})
    if data is None:
        return False

    is_valid = bool(data.get("is_valid", False))
    logger.debug("borzo_address_validation address_len=%s valid=%s", len(address), is_valid)
    return is_valid


def create_delivery_order(
    order_id: str,
    pickup_address: str,
    delivery_address: str,
    customer_phone: str,
    customer_name: str,
    items_description: str = "Apparel",
) -> dict:
    """
    Dispatch a real delivery order via Borzo.

    Returns a result dict — never raises:
    {
        "success": True,
        "borzo_order_id": "...",
        "delivery_fee":   123.45,
        "tracking_url":   "https://...",
    }
    — or on failure —
    {
        "success": False,
        "error":   "human-readable reason",
        "error_code": "BORZO_AUTH" | "BORZO_VALIDATION" | "BORZO_TIMEOUT"
                    | "BORZO_API" | "BORZO_MISSING_FIELDS" | "UNKNOWN",
    }
    """
    # ── Guard: required fields ──────────────────────────────────────────────
    missing = [f for f, v in [
        ("order_id",          order_id),
        ("pickup_address",    pickup_address),
        ("delivery_address",  delivery_address),
        ("customer_phone",    customer_phone),
        ("customer_name",     customer_name),
    ] if not v or not str(v).strip()]

    if missing:
        logger.error("borzo_create_order missing fields=%s order=%s", missing, order_id)
        return {
            "success":    False,
            "error":      f"Missing required fields: {', '.join(missing)}",
            "error_code": "BORZO_MISSING_FIELDS",
        }

    # ── Guard: configuration ────────────────────────────────────────────────
    if not BORZO_API_TOKEN:
        return {
            "success":    False,
            "error":      "Borzo API token not configured",
            "error_code": "BORZO_AUTH",
        }

    payload = {
        "matter": items_description,
        "points": [
            {
                "address": pickup_address,
                "contact_person": {
                    "phone": STORE_PHONE,
                    "name":  STORE_NAME,
                },
                "note": f"Pickup — Order #{order_id}",
            },
            {
                "address": delivery_address,
                "contact_person": {
                    "phone": customer_phone,
                    "name":  customer_name,
                },
                "note": "Please call customer upon arrival.",
            },
        ],
    }

    logger.info("borzo_dispatch_start order=%s", order_id)
    data = _post("create-order", payload)

    # ── Network / HTTP failure ───────────────────────────────────────────────
    if data is None:
        return {
            "success":    False,
            "error":      "Borzo API unavailable — delivery will be retried",
            "error_code": "BORZO_TIMEOUT",
        }

    # ── API-level failure ────────────────────────────────────────────────────
    if not data.get("is_successful", False):
        errors = data.get("parameter_errors") or data.get("errors") or []
        msg = ", ".join(errors) if errors else "Borzo rejected the order"
        logger.error("borzo_dispatch_rejected order=%s reason=%s", order_id, msg)
        return {
            "success":    False,
            "error":      msg,
            "error_code": "BORZO_VALIDATION",
        }

    # ── Success ──────────────────────────────────────────────────────────────
    order_info    = data.get("order", {})
    borzo_id      = order_info.get("order_id")
    tracking_url  = order_info.get("tracking_url", "")
    delivery_fee  = order_info.get("payment_amount")

    if not borzo_id:
        logger.error("borzo_dispatch_missing_id order=%s response_keys=%s",
                     order_id, list(order_info.keys()))
        return {
            "success":    False,
            "error":      "Borzo returned no order ID",
            "error_code": "BORZO_API",
        }

    logger.info("borzo_dispatch_success order=%s borzo_id=%s", order_id, borzo_id)
    return {
        "success":        True,
        "borzo_order_id": str(borzo_id),
        "delivery_fee":   float(delivery_fee) if delivery_fee is not None else None,
        "tracking_url":   tracking_url,
    }


def get_order_status(borzo_order_id: str) -> Optional[dict]:
    """
    Fetch live tracking info for an existing Borzo delivery.

    Returns the raw order dict from Borzo, or None on failure.
    """
    if not borzo_order_id:
        return None

    data = _post("order", {"order_id": borzo_order_id})
    if data is None:
        return None

    order_info = data.get("order")
    if order_info:
        logger.info("borzo_status borzo_id=%s status=%s",
                    borzo_order_id, order_info.get("status"))
    return order_info


def cancel_delivery_order(borzo_order_id: str) -> dict:
    """
    Cancel an active Borzo delivery.

    Returns:
        {"success": True,  "message": "..."}
        {"success": False, "message": "..."}
    """
    if not borzo_order_id:
        return {"success": False, "message": "No Borzo order ID provided"}

    data = _post("cancel-order", {"order_id": borzo_order_id})
    if data is None:
        return {"success": False, "message": "Borzo API unavailable"}

    if data.get("is_successful"):
        logger.info("borzo_cancel_success borzo_id=%s", borzo_order_id)
        return {"success": True, "message": "Order cancelled successfully"}

    errors = data.get("errors", ["Unknown cancellation error"])
    msg = ", ".join(errors) if isinstance(errors, list) else str(errors)
    logger.warning("borzo_cancel_failed borzo_id=%s reason=%s", borzo_order_id, msg)
    return {"success": False, "message": f"Cancellation failed: {msg}"}
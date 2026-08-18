from sys import exception

import requests
from django.core.cache import cache

BASE = "https://dattebayo-api.onrender.com"
TIMEOUT = 60 
CACHE_TTL = 60 * 60 

def UpstreamError(message):
    return Exception(message)


def _get(path, params=None, cache_key=None):
    if cache_key:
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

    try:
        response = requests.get(f"{BASE}{path}", params=params, timeout=TIMEOUT)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        raise UpstreamError(f"Error fetching data from upstream API: {e}")

    if cache_key:
        cache.set(cache_key, data, timeout=CACHE_TTL)
    return data


def fetch_characters(page=1, limit=10, name=None):
    params = {"page": page, "limit": limit}
    if name:
        params["name"] = name
    return _get("/characters", params, cache_key=f"characters_p{page}_l{limit}_n{name}")


def fetch_character(pk):
    return _get(f"/characters/{pk}", cache_key=f"character_{pk}")

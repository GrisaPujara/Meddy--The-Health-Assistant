import json
import random
import string
import threading
import uuid
from datetime import datetime
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "family.json"
_lock = threading.Lock()


def _empty():
    return {"families": []}


def _load():
    if not DATA_PATH.exists():
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        DATA_PATH.write_text(json.dumps(_empty(), indent=2), encoding="utf-8")
    try:
        return json.loads(DATA_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return _empty()


def _save(data):
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    DATA_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _code():
    chars = string.ascii_uppercase + string.digits
    return "MEDDY-" + "".join(random.choice(chars) for _ in range(6))


def _find_family(data, email):
    email = email.lower()
    for family in data["families"]:
        if any(member["email"] == email for member in family["members"]):
            return family
    return None


def _family_by_code(data, invite_code):
    code = invite_code.strip().upper()
    for family in data["families"]:
        if family["inviteCode"] == code:
            return family
    return None


def get_family(email: str):
    with _lock:
        data = _load()
        family = _find_family(data, email.lower())
        return family


def create_family(email: str, display_name: str, family_name: str = ""):
    email = email.lower()
    with _lock:
        data = _load()
        if _find_family(data, email):
            raise ValueError("You already belong to a family plan.")

        family = {
            "id": str(uuid.uuid4()),
            "name": family_name.strip() or f"{display_name}'s family",
            "inviteCode": _code(),
            "ownerEmail": email,
            "members": [
                {
                    "email": email,
                    "displayName": display_name,
                    "joinedAt": datetime.utcnow().isoformat() + "Z",
                }
            ],
            "people": [
                {
                    "id": str(uuid.uuid4()),
                    "name": display_name or "Me",
                    "role": "You",
                }
            ],
            "reminders": [],
        }
        data["families"].append(family)
        _save(data)
        return family


def join_family(email: str, display_name: str, invite_code: str):
    email = email.lower()
    with _lock:
        data = _load()
        if _find_family(data, email):
            raise ValueError("You already belong to a family plan. Leave it first to join another.")

        family = _family_by_code(data, invite_code)
        if not family:
            raise ValueError("Invalid family invite code.")

        family["members"].append(
            {
                "email": email,
                "displayName": display_name,
                "joinedAt": datetime.utcnow().isoformat() + "Z",
            }
        )
        if not any(person["name"].lower() == display_name.lower() for person in family["people"]):
            family["people"].append(
                {
                    "id": str(uuid.uuid4()),
                    "name": display_name or email.split("@")[0],
                    "role": "Family",
                }
            )
        _save(data)
        return family


def leave_family(email: str):
    email = email.lower()
    with _lock:
        data = _load()
        family = _find_family(data, email)
        if not family:
            return None
        family["members"] = [m for m in family["members"] if m["email"] != email]
        if family["ownerEmail"] == email and family["members"]:
            family["ownerEmail"] = family["members"][0]["email"]
        if not family["members"]:
            data["families"] = [f for f in data["families"] if f["id"] != family["id"]]
        _save(data)
        return True


def add_person(email: str, name: str, role: str):
    email = email.lower()
    with _lock:
        data = _load()
        family = _find_family(data, email)
        if not family:
            raise ValueError("Create or join a family plan first.")
        person = {
            "id": str(uuid.uuid4()),
            "name": name.strip(),
            "role": role.strip() or "Family",
        }
        family["people"].append(person)
        _save(data)
        return family


def add_reminder(email: str, payload: dict):
    email = email.lower()
    with _lock:
        data = _load()
        family = _find_family(data, email)
        if not family:
            raise ValueError("Create or join a family plan first.")

        reminder = {
            "id": str(uuid.uuid4()),
            "type": payload["type"],
            "title": payload["title"].strip(),
            "notes": payload.get("notes", "").strip(),
            "personId": payload["personId"],
            "time": payload["time"],
            "date": payload.get("date") or "",
            "repeat": payload.get("repeat") or "once",
            "enabled": True,
            "createdBy": email,
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }
        family["reminders"].append(reminder)
        _save(data)
        return family


def update_reminder(email: str, reminder_id: str, patch: dict):
    email = email.lower()
    with _lock:
        data = _load()
        family = _find_family(data, email)
        if not family:
            raise ValueError("Family plan not found.")
        for reminder in family["reminders"]:
            if reminder["id"] == reminder_id:
                reminder.update({k: v for k, v in patch.items() if v is not None})
                _save(data)
                return family
        raise ValueError("Reminder not found.")


def delete_reminder(email: str, reminder_id: str):
    email = email.lower()
    with _lock:
        data = _load()
        family = _find_family(data, email)
        if not family:
            raise ValueError("Family plan not found.")
        family["reminders"] = [r for r in family["reminders"] if r["id"] != reminder_id]
        _save(data)
        return family

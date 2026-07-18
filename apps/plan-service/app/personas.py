"""Persona catalog exposed as reference data for the plan editor / simulation setup UI.
This is the same seed catalog the Simulation Service uses internally for movement
mechanics — kept as an independent copy per service on purpose, per this project's
microservices boundary rule: each service owns its own reference data rather than
importing across a service boundary."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel

PersonaObjective = Literal[
    "reach_nearest_exit_fast",
    "reach_accessible_exit",
    "navigate_to_service_point",
    "wander_and_browse",
    "deliver_and_locate_service_elevator",
]

MobilityProfile = Literal["standard", "wheelchair", "stroller", "visually_impaired"]


class PersonaDefinition(BaseModel):
    id: str
    name: str
    description: str
    objective: PersonaObjective
    traits: list[str]
    mobility_profile: MobilityProfile
    speed_factor: float


SEED_PERSONAS: list[PersonaDefinition] = [
    PersonaDefinition(
        id="rushed_commuter",
        name="Rushed Commuter",
        description="Late for a meeting, takes the shortest path even through crowds.",
        objective="reach_nearest_exit_fast",
        traits=[
            "impatient",
            "low tolerance for waiting or queuing",
            "will attempt to squeeze past other agents rather than reroute",
        ],
        mobility_profile="standard",
        speed_factor=1.4,
    ),
    PersonaDefinition(
        id="wheelchair_visitor",
        name="Wheelchair User",
        description="Requires step-free routes; treats stairs as impassable.",
        objective="reach_accessible_exit",
        traits=[
            "never selects a stairs cell as a valid move",
            "actively seeks ramp or elevator cells",
            "notices and reports corridors narrower than 0.9m",
        ],
        mobility_profile="wheelchair",
        speed_factor=0.8,
    ),
    PersonaDefinition(
        id="parent_with_stroller",
        name="Parent with Stroller",
        description="Navigating with a stroller, needs wide doorways and service points.",
        objective="navigate_to_service_point",
        traits=[
            "avoids stairs",
            "needs doorways wider than 0.8m",
            "prioritizes finding a service_point (e.g. changing room)",
        ],
        mobility_profile="stroller",
        speed_factor=0.7,
    ),
    PersonaDefinition(
        id="delivery_worker",
        name="Delivery Worker",
        description="Unfamiliar with the layout, hunting for the service elevator.",
        objective="deliver_and_locate_service_elevator",
        traits=[
            "unfamiliar with layout, explores rather than beelines",
            "gets frustrated and doubles back if stuck for multiple ticks",
            "prefers service_point and elevator cells over public routes",
        ],
        mobility_profile="standard",
        speed_factor=1.1,
    ),
    PersonaDefinition(
        id="elderly_visitor",
        name="Elderly Visitor",
        description="Slow and cautious, avoids crowds and stairs where possible.",
        objective="wander_and_browse",
        traits=[
            "moves cautiously near stairs",
            "avoids densely occupied cells",
            "prefers to rest rather than push through congestion",
        ],
        mobility_profile="standard",
        speed_factor=0.6,
    ),
]

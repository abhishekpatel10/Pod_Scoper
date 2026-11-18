from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check_endpoints():
    # Test /api/health
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data
    assert data["version"] == "2.0.0"

    # Test /health alias
    alias_response = client.get("/health")
    assert alias_response.status_code == 200


def test_analyze_endpoint_success():
    payload = {
        "transcript": "Marcus Vance VP Logistics: Our drivers wait 4 hours because EDI 214 messages lag behind Samsara sensor temperatures. We lost $1.4M in spoiled reefer claims. Dispatchers spend 4 hours cross referencing SAP S/4HANA.",
        "client_name": "TransCold Logistics",
        "industry_hint": "Cold-Chain Logistics"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "executive_summary" in data
    assert len(data["bottlenecks"]) == 3
    assert len(data["sprint_plan"]) >= 4
    assert "architecture_diagram" in data
    assert "flowchart LR" in data["architecture_diagram"]["mermaid_code"]
    assert "Enterprise_Systems" in data["architecture_diagram"]["mermaid_code"]


def test_analyze_endpoint_minimum_length_validation():
    """Verify that a transcript with fewer than 50 characters returns 422 Unprocessable Entity."""
    short_payload = {
        "transcript": "Too short",
        "client_name": "Test Client"
    }
    response = client.post("/api/analyze", json=short_payload)
    assert response.status_code == 422


def test_samples_endpoints():
    logistics_res = client.get("/api/samples/logistics")
    assert logistics_res.status_code == 200
    logistics_data = logistics_res.json()
    assert len(logistics_data["bottlenecks"]) == 3
    assert "Enterprise_Systems" in logistics_data["architecture_diagram"]["mermaid_code"]
    assert "SAP" in logistics_data["architecture_diagram"]["tech_stack_summary"]["enterprise_hooks"]

    healthcare_res = client.get("/api/samples/healthcare")
    assert healthcare_res.status_code == 200
    healthcare_data = healthcare_res.json()
    assert len(healthcare_data["bottlenecks"]) == 3
    assert "Enterprise_Systems" in healthcare_data["architecture_diagram"]["mermaid_code"]
    assert "Epic" in healthcare_data["architecture_diagram"]["tech_stack_summary"]["enterprise_hooks"]

    fintech_res = client.get("/api/samples/fintech")
    assert fintech_res.status_code == 200
    fintech_data = fintech_res.json()
    assert len(fintech_data["bottlenecks"]) == 3
    assert "Enterprise_Systems" in fintech_data["architecture_diagram"]["mermaid_code"]


def test_analyze_stream_endpoint():
    """Verify that /api/analyze/stream streams all 3 chained stages plus complete event."""
    payload = {
        "transcript": "Marcus Vance VP Logistics: Our drivers wait 4 hours because EDI 214 messages lag behind Samsara sensor temperatures. We lost $1.4M in spoiled reefer claims. Dispatchers spend 4 hours cross referencing SAP S/4HANA.",
        "client_name": "TransCold Logistics",
        "industry_hint": "Cold-Chain Logistics"
    }
    response = client.post("/api/analyze/stream", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers.get("content-type", "")

    events = []
    for line in response.iter_lines():
        if isinstance(line, bytes):
            line = line.decode("utf-8")
        if line.startswith("event:"):
            events.append(line.replace("event:", "").strip())

    assert "stage_1_bottlenecks" in events
    assert "stage_2_sprint" in events
    assert "stage_3_architecture" in events
    assert "complete" in events


def test_spa_static_and_not_found_routes():
    # An invalid API route should return 404 JSON, not HTML index
    api_404_res = client.get("/api/nonexistent_route")
    assert api_404_res.status_code == 404

    # The root path should return 200 (serving index.html when frontend/dist is present)
    root_res = client.get("/")
    assert root_res.status_code == 200


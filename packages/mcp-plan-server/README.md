# myriox-mcp-plan-server

MCP server exposing the currently-saved grid plans (walls, doors, exits, zones) as tools
for any MCP-aware client — the LangGraph agent runtime, Claude Desktop, and other
MCP-compatible agent tooling.

## Tools

- `list_plans(org_id)` — list plan ids/names for an org.
- `get_grid_layout(org_id, plan_id)` — full cell grid + entry/exit points.
- `get_zone_metadata(org_id, plan_id)` — just the named zones.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .

export MYRIOX_COSMOS_ENDPOINT="https://myrioxdev-cosmos.documents.azure.com:443/"
export MYRIOX_COSMOS_KEY="<from Key Vault: myrioxdev-kv/cosmos-key>"
export MYRIOX_COSMOS_DATABASE="myriox"

python server.py
```

## Register with an MCP client

Example `mcp.json` entry:

```json
{
  "mcpServers": {
    "myriox-plan-server": {
      "command": "/absolute/path/to/.venv/bin/python",
      "args": ["/absolute/path/to/server.py"],
      "env": {
        "MYRIOX_COSMOS_ENDPOINT": "https://myrioxdev-cosmos.documents.azure.com:443/",
        "MYRIOX_COSMOS_KEY": "<key>",
        "MYRIOX_COSMOS_DATABASE": "myriox"
      }
    }
  }
}
```

## Phase 2 note

The tool contract (`get_grid_layout`, `get_zone_metadata`) is intentionally decoupled from
ingestion source. When Figma/CAD MCP import lands in Phase 2, an import job writes into the
same `plans` Cosmos container this server reads from — no tool signature changes needed.

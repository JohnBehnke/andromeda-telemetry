define([
    'openmct',
    './src/AndromedaTelemetryServerAdapter',
    './src/AndromedaTelemetryInitializer',
    './src/AndromedaTelemetryModelProvider'
], function(
    openmct,
    AndromedaTelemetryServerAdapter,
    AndromedaTelemetryInitializer,
    AndromedaTelemetryModelProvider
) {
    openmct.legacyRegistry.register("example/andromeda-telemetry", {
        "name": "Andromeda Telemetry Adapter",
        "extensions": {
            "types": [{
                "name": "Andromeda Rocket",
                "key": "andromeda.spacecraft",
                "cssclass": "icon-object"
            }, {
                "name": "Subsystem",
                "key": "andromeda.subsystem",
                "cssclass": "icon-object",
                "model": {
                    "composition": []
                }
            }, {
                "name": "Measurement",
                "key": "andromeda.measurement",
                "cssclass": "icon-telemetry",
                "model": {
                    "telemetry": {}
                },
                "telemetry": {
                    "source": "andromeda.source",
                    "domains": [{
                        "name": "Time",
                        "key": "timestamp"
                    }]
                }
            }],
            "roots": [{
                "id": "andromeda:sc",
                "priority": "preferred"
            }],
            "models": [{
                "id": "andromeda:sc",
                "model": {
                    "type": "andromeda.spacecraft",
                    "name": "Andromeda Rocket",
                    "location": "ROOT",
                    "composition": []
                }
            }],
            
            "services": [{
                "key": "andromeda.adapter",
                "implementation": AndromedaTelemetryServerAdapter,
                "depends": ["$q", "EXAMPLE_WS_URL"]
            }],
            "constants": [{
                "key": "EXAMPLE_WS_URL",
                "priority": "fallback",
                "value": "ws://localhost:8081"
            }],
            "runs": [{
                "implementation": AndromedaTelemetryInitializer,
                "depends": ["andromeda.adapter", "objectService"]
            }],
            "components": [{
                "provides": "modelService",
                "type": "provider",
                "implementation": AndromedaTelemetryModelProvider,
                "depends": ["andromeda.adapter", "$q"]
            },
            {
              "provides": "telemetryService",
              "type": "provider",
              "implementation": "AndromedaTelemetryProvider.js",
              "depends": [ "andromeda.adapter", "$q" ]
          }]
        }
    });
});
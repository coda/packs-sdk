# Setup

Connect the three systems during agent installation:

1. **CRM** uses its own OAuth connection.
2. **Billing** uses a bearer token.
3. **Support** uses an API key in the request query.

Each connector remains a normal Pack with separate auth, versioning, and review. The plugin gives the user one agent install flow and limits all three private connectors to that agent.

This shape also supports partial reuse. A user who already connected one system should keep that connector instance and authenticate only the missing systems.

---
title: "HTTP API reference"
description: "The public HTTP API for scripting and integrating with Scenery."
sidebar:
  order: 3
---

This is the public subset of the Scenery HTTP API, version 0.1.0. The base URL is `https://app.scenery.dev`. Endpoints not listed here are internal and can change without notice.

Send a Bearer token in the `Authorization` header. Endpoints under `/admin` need an organization admin session. All other endpoints use the signed-in user's token.

## Skills

Search, inspect, validate and publish skills.

### Browse skills

`GET /portal/skills`

Lists published skills, plus your own submissions that are still pending review.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `page` | query | integer | no |
| `page_size` | query | integer | no |
| `search` | query | string | no |
| `category` | query | string | no |
| `tags` | query | string | no |
| `type` | query | string | no |
| `scope` | query | string | no |

**Responses**

- `200`: Success. Returns [SkillListResponse](#skilllistresponse).

### Get skill details

`GET /portal/skills/{skill_id}`

Returns a skill and its published versions. Full detail requires a signed-in user.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [SkillDetailWithVersions](#skilldetailwithversions).

### Validate or publish a skill

`POST /portal/skills/compile`

Validates a SKILL.md bundle. With `publish=true` it also publishes the bundle as a new version.

**Request body** (`multipart/form-data`): [ValidateOrPublishASkillRequest](#validateorpublishaskillrequest)

**Responses**

- `200`: Success. Returns object.
- `202`: Accepted.
- `400`: Bad request.
- `409`: Conflict.

### Preview an import

`POST /portal/import/preview`

Classifies an external skill or MCP server reference and returns a preview without storing anything.

**Request body** (`application/json`): [ImportRequest](#importrequest)

**Responses**

- `200`: Success. Returns object.

### Submit an import

`POST /portal/import/submit`

Imports a skill, or requests an MCP server, from an external reference.

**Request body** (`application/json`): [ImportRequest](#importrequest)

**Responses**

- `201`: Created. Returns object.

### Get skill version metadata

`GET /skills/{skill_id}/versions/{version}`

Returns download location, SHA-256 checksum and size for a published skill version.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |
| `version` | path | string | yes |

**Responses**

- `200`: Success. Returns [ArtifactMetadataResponse](#artifactmetadataresponse).

### Check skill status

`POST /skills/status`

Takes a list of skill IDs and reports whether each is published, unpublished or unknown.

**Request body** (`application/json`): [SkillStatusRequest](#skillstatusrequest)

**Responses**

- `200`: Success. Returns [SkillStatusResponse](#skillstatusresponse).

### Search skills

`GET /skills/search`

Search the skill catalog. Pass the query as the `q` parameter.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `q` | query | string | no |
| `category` | query | string | no |
| `tags` | query | string | no |

**Responses**

- `200`: Success. Returns array of object.

## Your installs

Install and remove skills, MCP servers and plugins on your devices.

### Install a skill

`POST /installations`

Requests a skill install on one device, or on all of your devices when `device_id` is omitted.

**Request body** (`application/json`): [InstallationCreateRequest](#installationcreaterequest)

**Responses**

- `201`: Created. Returns [InstallationCreateResponse](#installationcreateresponse).

### Remove a skill install

`DELETE /installations/{installation_id}`

Deactivates a skill installation.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `installation_id` | path | string | yes |

**Responses**

- `204`: No content.

### List my skill installs

`GET /installations/mine`

Lists your skill installations across all of your devices.

**Responses**

- `200`: Success. Returns [InstallationListResponse](#installationlistresponse).

### Install an MCP server

`POST /mcp-installations`

Requests an MCP server install on one device, or on all of your devices.

**Request body** (`application/json`): [McpInstallationCreateRequest](#mcpinstallationcreaterequest)

**Responses**

- `201`: Created. Returns [McpInstallationCreateResponse](#mcpinstallationcreateresponse).

### Remove an MCP install

`DELETE /mcp-installations/{installation_id}`

Deactivates an MCP server installation.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `installation_id` | path | string | yes |

**Responses**

- `204`: No content.

### List my MCP installs

`GET /mcp-installations/mine`

Lists your MCP server installations.

**Responses**

- `200`: Success. Returns [McpInstallationListResponse](#mcpinstallationlistresponse).

### Install a plugin

`POST /plugin-installations`

Installs a plugin and the skills and MCP servers it contains. Missing parts are reported in the response warnings.

**Request body** (`application/json`): [PluginInstallationCreateRequest](#plugininstallationcreaterequest)

**Responses**

- `201`: Created. Returns [PluginInstallationCreateResponse](#plugininstallationcreateresponse).

### Remove a plugin install

`DELETE /plugin-installations/{installation_id}`

Deactivates a plugin installation and the parts installed with it.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `installation_id` | path | string | yes |

**Responses**

- `204`: No content.

### List my plugin installs

`GET /plugin-installations/mine`

Lists your plugin installations.

**Responses**

- `200`: Success. Returns [PluginInstallationListResponse](#plugininstallationlistresponse).

## Admin: users and devices

Organization admin endpoints for people and devices, including the per-user and per-device kill switches.

### List devices

`GET /admin/devices`

Lists all devices in your organization with their owner and install count.

**Responses**

- `200`: Success. Returns [AdminDeviceListResponse](#admindevicelistresponse).

### Revoke a device

`POST /admin/devices/{device_id}/revoke`

Kill switch for one device: removes its installs and blocks it from syncing.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `device_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [AdminDeviceRevokeResponse](#admindevicerevokeresponse).

### Get device statistics

`GET /admin/devices/stats`

Organization-wide device and installation counts.

**Responses**

- `200`: Success. Returns [AdminDeviceStatsResponse](#admindevicestatsresponse).

### Get device details

`GET /admin/devices/{device_id}`

Returns one device with its installations.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `device_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [AdminDeviceDetail](#admindevicedetail).

### List installations

`GET /admin/installations`

Organization-wide installation list, filterable by state, skill and user. Paginated.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `state` | query | string | no |
| `skill_id` | query | string | no |
| `user_id` | query | string | no |
| `limit` | query | integer | no |
| `offset` | query | integer | no |

**Responses**

- `200`: Success. Returns [AdminInstallationListResponse](#admininstallationlistresponse).

### List users

`GET /admin/users`

Lists every user in your organization with device count and active status.

**Responses**

- `200`: Success. Returns [AdminUserListResponse](#adminuserlistresponse).

### List user activity

`GET /admin/users/activity`

Per-user sign-in and device activity, plus invite history.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `page` | query | integer | no |
| `page_size` | query | integer | no |
| `sort` | query | `email`, `created`, `last_login`, `login_count`, `device_count` | no |
| `order` | query | string | no |

**Responses**

- `200`: Success. Returns [UserActivityListResponse](#useractivitylistresponse).

### Get user activity

`GET /admin/users/{user_id}/activity`

Sign-in and device activity for one user.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `user_id` | path | string (uuid) | yes |

**Responses**

- `200`: Success. Returns [UserActivityDetail](#useractivitydetail).

### Revoke a user

`POST /admin/users/{user_id}/revoke`

Kill switch for one user: blocks their access immediately and removes their installs from every device.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `user_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [AdminUserRevokeResponse](#adminuserrevokeresponse).

### Restore a user

`POST /admin/users/{user_id}/restore`

Re-enables a revoked user. Installs and devices are not restored; the user sets them up again.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `user_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [AdminUserListItem](#adminuserlistitem).

## Admin: audit

Audit trails for export and review.

### List audit log

`GET /admin/audit-log`

Lists admin audit log entries, with filters.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `resource_type` | query | string | no |
| `admin_user_id` | query | string | no |
| `action` | query | string | no |
| `resource_id` | query | string | no |
| `date_from` | query | string (date-time) | no |
| `date_to` | query | string (date-time) | no |
| `search` | query | string | no |
| `limit` | query | integer | no |
| `offset` | query | integer | no |

**Responses**

- `200`: Success. Returns object.

### Export audit log

`GET /admin/audit-log/export`

Exports the admin audit log as CSV.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `resource_type` | query | string | no |
| `admin_user_id` | query | string | no |
| `action` | query | string | no |
| `resource_id` | query | string | no |
| `date_from` | query | string (date-time) | no |
| `date_to` | query | string (date-time) | no |
| `search` | query | string | no |

**Responses**

- `200`: Success. Returns object.

### List device audit events

`GET /admin/runner-audit`

Lists audit events reported by Scenery on employee devices, newest first.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `event_type` | query | string | no |
| `device_id` | query | string | no |
| `user_email` | query | string | no |
| `limit` | query | integer | no |
| `offset` | query | integer | no |

**Responses**

- `200`: Success. Returns object.

### List MCP audit log

`GET /admin/mcp/audit`

Lists MCP governance audit entries, with filters.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `server_name` | query | string | no |
| `user_email` | query | string | no |
| `event_type` | query | string | no |
| `since` | query | string (date-time) | no |
| `until` | query | string (date-time) | no |
| `limit` | query | integer | no |
| `offset` | query | integer | no |

**Responses**

- `200`: Success. Returns [AuditLogListResponse](#auditloglistresponse).

## Admin: catalog and revocation

Manage skills, MCP servers and plugins, and revoke them everywhere.

### List skills

`GET /admin/skills`

Paginated list of skills with optional filters.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `page` | query | integer | no |
| `page_size` | query | integer | no |
| `publisher_slug` | query | string | no |
| `category` | query | string | no |
| `search` | query | string | no |
| `type` | query | string | no |

**Responses**

- `200`: Success. Returns [SkillListResponse](#skilllistresponse).

### Get skill

`GET /admin/skills/{skill_id}`

Returns one skill with its publisher and versions.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [SkillDetailWithVersions](#skilldetailwithversions).

### Archive a skill

`POST /admin/skills/{skill_id}/archive`

Marks a skill inactive. Existing installs are kept.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [SkillResponse](#skillresponse).

### Unarchive a skill

`POST /admin/skills/{skill_id}/unarchive`

Makes an archived skill active again.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [SkillResponse](#skillresponse).

### Revoke a skill

`POST /admin/skills/{skill_id}/revoke`

Kill switch: removes the skill from every device that has it.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Request body** (`application/json`): [RevokeRequest](#revokerequest)

**Responses**

- `200`: Success. Returns [RevokeResponse](#revokeresponse).

### Lift a skill revocation

`POST /admin/skills/{skill_id}/unrevoke`

Clears the revocation. Devices that already removed the skill do not get it back; users reinstall.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Request body** (`application/json`): [UnrevokeRequest](#unrevokerequest)

**Responses**

- `200`: Success. Returns [UnrevokeResponse](#unrevokeresponse).

### List skill versions

`GET /admin/skills/{skill_id}/versions`

Lists all versions of a skill, newest first.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `skill_id` | path | string | yes |

**Responses**

- `200`: Success. Returns array of [VersionDetailResponse](#versiondetailresponse).

### List MCP servers

`GET /admin/mcp/servers`

Lists the MCP servers in your organization's catalog.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `status` | query | string | no |
| `search` | query | string | no |

**Responses**

- `200`: Success. Returns [McpServerListResponse](#mcpserverlistresponse).

### Get MCP server

`GET /admin/mcp/servers/{server_id}`

Returns one MCP server catalog entry.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `server_id` | path | string | yes |

**Responses**

- `200`: Success. Returns [McpServerResponse](#mcpserverresponse).

### Revoke an MCP server

`POST /admin/mcp/servers/{server_id}/revoke`

Kill switch: removes the server from every device that has it.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `server_id` | path | string | yes |

**Request body** (`application/json`): [RevokeRequest](#revokerequest)

**Responses**

- `200`: Success. Returns [RevokeResponse](#revokeresponse).

### Lift an MCP server revocation

`POST /admin/mcp/servers/{server_id}/unrevoke`

Clears the revocation. Users reinstall the server.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `server_id` | path | string | yes |

**Request body** (`application/json`): [UnrevokeRequest](#unrevokerequest)

**Responses**

- `200`: Success. Returns [UnrevokeResponse](#unrevokeresponse).

### List plugins

`GET /admin/plugins`

Lists the plugins in your organization's catalog.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `search` | query | string | no |
| `category` | query | string | no |
| `status` | query | string | no |
| `page` | query | integer | no |
| `page_size` | query | integer | no |

**Responses**

- `200`: Success. Returns [PluginListResponse](#pluginlistresponse).

### Get plugin

`GET /admin/plugins/{slug}`

Returns one plugin.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `slug` | path | string | yes |

**Responses**

- `200`: Success. Returns [PluginDetailResponse](#plugindetailresponse).

### Revoke a plugin

`POST /admin/plugins/{slug}/revoke`

Kill switch: removes the plugin from every device that has it.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `slug` | path | string | yes |

**Request body** (`application/json`): [RevokeRequest](#revokerequest)

**Responses**

- `200`: Success. Returns [RevokeResponse](#revokeresponse).

### Lift a plugin revocation

`POST /admin/plugins/{slug}/unrevoke`

Clears the revocation. Users reinstall the plugin.

| Parameter | In | Type | Required |
| --- | --- | --- | --- |
| `slug` | path | string | yes |

**Request body** (`application/json`): [UnrevokeRequest](#unrevokerequest)

**Responses**

- `200`: Success. Returns [UnrevokeResponse](#unrevokeresponse).

## Objects

Request and response objects referenced above.

### ActivityDevice

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `hostname` | string | yes |
| `display_name` | string | yes |
| `platform` | string | yes |
| `arch` | string | yes |
| `runner_version` | string | yes |
| `status` | string | yes |
| `registered_at` | string (date-time) | yes |
| `revoked_at` | string (date-time) | yes |

### ActivityInvite

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `email` | string | yes |
| `type` | string | yes |
| `role` | string | yes |
| `status` | string | yes |
| `invited_by_email` | string | yes |
| `invited_by_label` | string | yes |
| `created_at` | string (date-time) | yes |
| `expires_at` | string (date-time) | yes |
| `accepted_at` | string (date-time) | yes |

### ActivityInviteCounts

| Field | Type | Required |
| --- | --- | --- |
| `sent` | integer | yes |
| `pending` | integer | yes |
| `accepted` | integer | yes |
| `expired` | integer | yes |
| `revoked` | integer | yes |

### AdminDeviceDetail

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `hostname` | string | yes |
| `platform` | string | yes |
| `arch` | string | yes |
| `agent_version` | string | yes |
| `display_name` | string | yes |
| `status` | string | yes |
| `registered_at` | string (date-time) | yes |
| `revoked_at` | string (date-time) | no |
| `deprovisioned_at` | string (date-time) | no |
| `user` | [AdminDeviceUserInfo](#admindeviceuserinfo) | yes |
| `installations` | array of [AdminInstallationResponse](#admininstallationresponse) | yes |
| `mcp_installations` | array of [AdminMcpInstallationResponse](#adminmcpinstallationresponse) | no |

### AdminDeviceListResponse

| Field | Type | Required |
| --- | --- | --- |
| `devices` | array of [AdminDeviceResponse](#admindeviceresponse) | yes |

### AdminDeviceResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `hostname` | string | yes |
| `platform` | string | yes |
| `arch` | string | yes |
| `agent_version` | string | yes |
| `display_name` | string | yes |
| `status` | string | yes |
| `registered_at` | string (date-time) | yes |
| `revoked_at` | string (date-time) | no |
| `deprovisioned_at` | string (date-time) | no |
| `installation_count` | integer | yes |
| `user` | [AdminDeviceUserInfo](#admindeviceuserinfo) | yes |

### AdminDeviceRevokeResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `revoked_at` | string (date-time) | yes |
| `skills_deactivated` | integer | yes |
| `mcp_deactivated` | integer | yes |
| `plugins_deactivated` | integer | yes |

### AdminDeviceStatsResponse

| Field | Type | Required |
| --- | --- | --- |
| `devices_total` | integer | yes |
| `devices_active` | integer | yes |
| `devices_offline` | integer | yes |
| `devices_stale` | integer | yes |
| `installs_total` | integer | yes |
| `installs_pending` | integer | yes |
| `installs_error` | integer | yes |
| `skills_in_use` | array of string | yes |

### AdminDeviceUserInfo

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `email` | string | yes |
| `display_name` | string | yes |

### AdminInstallationListItem

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `skill_id` | string | yes |
| `version` | string | yes |
| `state` | string | yes |
| `source` | string | yes |
| `error_message` | string | yes |
| `desired_at` | string (date-time) | yes |
| `installed_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `device_id` | string | yes |
| `device_hostname` | string | yes |
| `device_display_name` | string | yes |
| `user_id` | string | yes |
| `user_email` | string | yes |

### AdminInstallationListResponse

| Field | Type | Required |
| --- | --- | --- |
| `items` | array of [AdminInstallationListItem](#admininstallationlistitem) | yes |
| `total` | integer | yes |

### AdminInstallationResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `skill_id` | string | yes |
| `version` | string | yes |
| `state` | string | yes |
| `source` | string | yes |
| `error_message` | string | yes |
| `desired_at` | string (date-time) | yes |
| `installed_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |

### AdminMcpInstallationResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `mcp_server_id` | string | yes |
| `mcp_server_name` | string | yes |
| `state` | string | yes |
| `source` | string | no |
| `error_message` | string | no |
| `desired_at` | string (date-time) | yes |
| `installed_at` | string (date-time) | no |
| `updated_at` | string (date-time) | yes |

### AdminUserListItem

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `email` | string | yes |
| `display_name` | string | yes |
| `is_active` | boolean | yes |
| `device_count` | integer | yes |
| `created_at` | string (date-time) | yes |
| `last_login_at` | string (date-time) | yes |

### AdminUserListResponse

| Field | Type | Required |
| --- | --- | --- |
| `users` | array of [AdminUserListItem](#adminuserlistitem) | yes |

### AdminUserRevokeResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `is_active` | boolean | yes |
| `devices_disconnected` | integer | yes |
| `skills_deactivated` | integer | yes |
| `mcp_deactivated` | integer | yes |
| `plugins_deactivated` | integer | yes |
| `oauth_credentials_revoked` | integer | yes |

### ArtifactMetadataResponse

| Field | Type | Required |
| --- | --- | --- |
| `skill_id` | string | yes |
| `version` | string | yes |
| `sha256` | string | yes |
| `size_bytes` | integer | no |

### AuditLogEntry

| Field | Type | Required |
| --- | --- | --- |
| `id` | integer | yes |
| `server_name` | string | yes |
| `user_id` | string | yes |
| `user_email` | string | yes |
| `event_type` | string | yes |
| `tool_name` | string | yes |
| `timestamp` | string (date-time) | yes |

### AuditLogListResponse

| Field | Type | Required |
| --- | --- | --- |
| `items` | array of [AuditLogEntry](#auditlogentry) | yes |
| `total` | integer | yes |

### BundleFile

| Field | Type | Required |
| --- | --- | --- |
| `path` | string | yes |
| `size_bytes` | integer | yes |
| `sha256` | string | yes |

### ImportRequest

| Field | Type | Required |
| --- | --- | --- |
| `url` | string | yes |
| `duplicate_resolution` | string | no |

### InstallationCreateRequest

| Field | Type | Required |
| --- | --- | --- |
| `skill_id` | string | yes |
| `version` | string | no |
| `device_id` | string | no |
| `source` | string | no |

### InstallationCreateResponse

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `state` | string | yes |
| `skill_id` | string | yes |
| `version` | string | yes |

### InstallationListResponse

| Field | Type | Required |
| --- | --- | --- |
| `installations` | array of [InstallationResponse](#installationresponse) | yes |

### InstallationResponse

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `device_id` | string | yes |
| `device_display_name` | string | yes |
| `skill_id` | string | yes |
| `version` | string | yes |
| `latest_version` | string | no |
| `state` | string | yes |
| `source` | string | yes |
| `error_message` | string | yes |
| `desired_at` | string (date-time) | yes |
| `installed_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |

### McpInstallationCreateRequest

| Field | Type | Required |
| --- | --- | --- |
| `mcp_server_id` | string | yes |
| `device_id` | string | no |
| `source` | string | no |

### McpInstallationCreateResponse

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `state` | string | yes |
| `mcp_server_id` | string | yes |

### McpInstallationListResponse

| Field | Type | Required |
| --- | --- | --- |
| `installations` | array of [McpInstallationResponse](#mcpinstallationresponse) | yes |

### McpInstallationResponse

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `device_id` | string | yes |
| `device_display_name` | string | yes |
| `mcp_server_id` | string | yes |
| `mcp_server_name` | string | yes |
| `auth_type` | string | yes |
| `state` | string | yes |
| `source` | string | yes |
| `error_message` | string | yes |
| `desired_at` | string (date-time) | yes |
| `installed_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |

### McpServerListResponse

| Field | Type | Required |
| --- | --- | --- |
| `items` | array of [McpServerResponse](#mcpserverresponse) | yes |
| `total` | integer | yes |

### McpServerResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string (uuid) | yes |
| `name` | string | yes |
| `status` | string | yes |
| `auth_type` | string | yes |
| `created_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `submitted_by` | string (uuid) | no |
| `submitter_email` | string | no |
| `source` | string | yes |
| `origin` | `org`, `created`, `imported` | no |

### PluginDetailResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `slug` | string | yes |
| `name` | string | yes |
| `publisher_id` | string | yes |
| `publisher_slug` | string | no |
| `publisher_name` | string | no |
| `status` | string | yes |
| `install_count` | integer | yes |
| `category` | string | yes |
| `tags` | array of string | yes |
| `latest_version` | string | yes |
| `created_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `version_count` | integer | no |
| `origin` | `org`, `created`, `imported` | no |
| `versions` | array of [PluginVersionBrief](#pluginversionbrief) | no |

### PluginInstallChildMcp

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `mcp_server_id` | string | yes |
| `mcp_server_name` | string | yes |
| `state` | string | yes |

### PluginInstallChildSkill

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `skill_id` | string | yes |
| `version` | string | yes |
| `state` | string | yes |

### PluginInstallationCreateRequest

| Field | Type | Required |
| --- | --- | --- |
| `plugin_slug` | string | yes |
| `version` | string | no |
| `device_id` | string | no |

### PluginInstallationCreateResponse

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `state` | string | yes |
| `plugin_slug` | string | yes |
| `version` | string | yes |
| `skill_children` | array of [PluginInstallChildSkill](#plugininstallchildskill) | no |
| `mcp_children` | array of [PluginInstallChildMcp](#plugininstallchildmcp) | no |
| `warnings` | array of string | no |

### PluginInstallationListResponse

| Field | Type | Required |
| --- | --- | --- |
| `installations` | array of [PluginInstallationResponse](#plugininstallationresponse) | yes |

### PluginInstallationResponse

| Field | Type | Required |
| --- | --- | --- |
| `installation_id` | string | yes |
| `device_id` | string | yes |
| `plugin_slug` | string | yes |
| `plugin_name` | string | yes |
| `version` | string | yes |
| `state` | string | yes |
| `source` | string | yes |
| `error_message` | string | yes |
| `desired_at` | string (date-time) | yes |
| `installed_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `skill_children` | array of [PluginInstallChildSkill](#plugininstallchildskill) | no |
| `mcp_children` | array of [PluginInstallChildMcp](#plugininstallchildmcp) | no |
| `warnings` | array of string | no |

### PluginListResponse

| Field | Type | Required |
| --- | --- | --- |
| `items` | array of [PluginResponse](#pluginresponse) | yes |
| `total` | integer | yes |
| `page` | integer | yes |
| `page_size` | integer | yes |

### PluginResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `slug` | string | yes |
| `name` | string | yes |
| `publisher_id` | string | yes |
| `publisher_slug` | string | no |
| `publisher_name` | string | no |
| `status` | string | yes |
| `install_count` | integer | yes |
| `category` | string | yes |
| `tags` | array of string | yes |
| `latest_version` | string | yes |
| `created_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `version_count` | integer | no |
| `origin` | `org`, `created`, `imported` | no |

### PluginVersionBrief

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `version` | string | yes |
| `channel` | string | yes |
| `status` | string | yes |
| `is_published` | boolean | yes |
| `sha256` | string | no |
| `size_bytes` | integer | no |
| `created_at` | string (date-time) | yes |

### RevokeRequest

| Field | Type | Required |
| --- | --- | --- |
| `version` | string | no |
| `reason` | string | no |

### RevokeResponse

| Field | Type | Required |
| --- | --- | --- |
| `revoked` | boolean | no |
| `artifact_type` | string | yes |
| `version` | string | yes |
| `affected_devices` | integer | yes |

### SkillDetailWithVersions

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `skill_id` | string | yes |
| `name` | string | yes |
| `publisher_id` | string | yes |
| `publisher_slug` | string | no |
| `publisher_name` | string | no |
| `license` | string | yes |
| `source` | string | yes |
| `install_count` | integer | yes |
| `category` | string | yes |
| `tags` | array of string | yes |
| `created_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `version_count` | integer | no |
| `latest_version` | string | no |
| `skill_type` | string | no |
| `pending_review` | boolean | no |
| `archived_at` | string (date-time) | no |
| `origin` | `org`, `created`, `imported` | no |
| `versions` | array of [SkillVersionBrief](#skillversionbrief) | no |
| `body_markdown` | string | no |
| `source_url` | string | no |
| `bundle_files` | array of [BundleFile](#bundlefile) | no |
| `bundle_total_bytes` | integer | no |

### SkillListResponse

| Field | Type | Required |
| --- | --- | --- |
| `items` | array of [SkillResponse](#skillresponse) | yes |
| `total` | integer | yes |
| `page` | integer | yes |
| `page_size` | integer | yes |

### SkillResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `skill_id` | string | yes |
| `name` | string | yes |
| `publisher_id` | string | yes |
| `publisher_slug` | string | no |
| `publisher_name` | string | no |
| `license` | string | yes |
| `source` | string | yes |
| `install_count` | integer | yes |
| `category` | string | yes |
| `tags` | array of string | yes |
| `created_at` | string (date-time) | yes |
| `updated_at` | string (date-time) | yes |
| `version_count` | integer | no |
| `latest_version` | string | no |
| `skill_type` | string | no |
| `pending_review` | boolean | no |
| `archived_at` | string (date-time) | no |
| `origin` | `org`, `created`, `imported` | no |

### SkillStatusEntry

| Field | Type | Required |
| --- | --- | --- |
| `status` | string | yes |
| `latest_version` | string | no |

### SkillStatusRequest

| Field | Type | Required |
| --- | --- | --- |
| `skill_ids` | array of string | yes |

### SkillStatusResponse

| Field | Type | Required |
| --- | --- | --- |
| `statuses` | object | yes |
| `unknown` | array of string | yes |

### SkillVersionBrief

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `version` | string | yes |
| `channel` | string | yes |
| `is_published` | boolean | yes |
| `created_at` | string (date-time) | yes |

### UnrevokeRequest

| Field | Type | Required |
| --- | --- | --- |
| `version` | string | no |

### UnrevokeResponse

| Field | Type | Required |
| --- | --- | --- |
| `cleared` | boolean | yes |
| `artifact_type` | string | yes |
| `version` | string | yes |

### UserActivityDetail

| Field | Type | Required |
| --- | --- | --- |
| `user` | [UserActivityItem](#useractivityitem) | yes |
| `invites` | array of [ActivityInvite](#activityinvite) | yes |
| `devices` | array of [ActivityDevice](#activitydevice) | yes |

### UserActivityItem

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `email` | string | yes |
| `display_name` | string | yes |
| `role` | string | yes |
| `is_active` | boolean | yes |
| `created_at` | string (date-time) | yes |
| `last_login_at` | string (date-time) | yes |
| `login_count_30d` | integer | yes |
| `device_count` | integer | yes |
| `active_device_count` | integer | yes |
| `invite_status` | string | yes |
| `invited_by_label` | string | yes |
| `invited_at` | string (date-time) | yes |

### UserActivityListResponse

| Field | Type | Required |
| --- | --- | --- |
| `items` | array of [UserActivityItem](#useractivityitem) | yes |
| `total` | integer | yes |
| `page` | integer | yes |
| `page_size` | integer | yes |
| `sort` | string | yes |
| `order` | string | yes |
| `invite_counts` | [ActivityInviteCounts](#activityinvitecounts) | yes |
| `invites` | array of [ActivityInvite](#activityinvite) | yes |

### ValidateOrPublishASkillRequest

| Field | Type | Required |
| --- | --- | --- |
| `file` | string | yes |
| `publish` | boolean | no |
| `duplicate_resolution` | string | no |

### VersionDetailResponse

| Field | Type | Required |
| --- | --- | --- |
| `id` | string | yes |
| `version` | string | yes |
| `channel` | string | yes |
| `sha256` | string | yes |
| `size_bytes` | integer | yes |
| `is_published` | boolean | yes |
| `published_at` | string (date-time) | yes |
| `created_at` | string (date-time) | yes |

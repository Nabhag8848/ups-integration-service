# Carrier Integration Server

## Database ERD

```mermaid
erDiagram
  carrier {
    uuid id PK
    timestamp createdAt
    timestamp updatedAt
    varchar clientId
    varchar provider
    text accessToken
    timestamp accessTokenExpiresAt
  }
  
```

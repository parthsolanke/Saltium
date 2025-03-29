<p align="center">
  <img src="./public/images/header.png" alt="header" width="400"/>
</p>


Saltium is a secure file-sharing app that encrypts and protects your files with JWT-based access control. Easily upload, encrypt, and share files via download links. Features include token expiration and link invalidation.

### To Do:
- Deploy backend
- Integrate backend APIs and frontend
- Use a Unique ID Instead of the Full Token
-- Instead of exposing the full JWT token in the URL, generate a unique ID (uuid) for each file share request. Example:
-- Store { shareId: "abc123", token: "actual-long-token" } in your database
-- Share the link as http://yourapp.com/dl/abc123
-- When a user accesses that link, fetch the corresponding token and validate it
- Public router (only p2p), p2p + uploads for private router.
- P2P file sharing (no size-limits)
- - Error Checking: Use checksums or hashes to verify file integrity after transfer.
- - Fallback Options: Consider implementing a fallback to a centralized server if P2P fails.

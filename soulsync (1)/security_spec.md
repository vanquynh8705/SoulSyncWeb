# Security Specification & Threat Model for SoulSync

## 1. Data Invariants
*   **User Identity**: A user profile path must correspond exactly to their Firebase Authentication UID (`/users/{uid}`). No profile mapping manipulation is permitted.
*   **Role Preservation (Anti-Escalation)**: Standard users cannot elevate their role to moderator or admin. The `isAdmin` flag is immutable for non-admin accounts.
*   **Content Authenticity**: Only authorized administrators are permitted to create, update, or delete articles and resources in the `/contents` directory.

## 2. The "Dirty Dozen" Payload Claims
We specify 12 target payloads that must be rejected explicitly by our Firestore rules engine:

1.  **Direct ID Hijacking (Create user profile for a random UID)**
    `allow create: if request.auth.uid == userId` -> Rejected when `userId` is spoofed.
2.  **Self-Admin Privilege Promotion (Create user with isAdmin: true)**
    `allow create` rejects where field `isAdmin == true`.
3.  **Cross-User Update (Modify other user profile details)**
    Rejected because client UID must match path parameter `{userId}`.
4.  **Malicious Admin Flag Injection in Update (Standard user toggles isAdmin to true)**
    Rejected because updating `isAdmin` checks `incoming().isAdmin == existing().isAdmin`.
5.  **Injecting Shadow Parameters (Adding extra fields like `reputationScore` to profiles)**
    Rejected by strict key size count verification (`keys().size() == 5`).
6.  **Admin Directory Access Bypass**
    An unauthenticated guest attempting to scan `/users`.
7.  **Unbounded Payload Injection (Creating 2MB text in content title)**
    Rejected by text and string `.size()` size boundaries (`data.title.size() <= 200`).
8.  **Anonymous User Content Poisoning (Guest trying to write/edit a guide)**
    Rejected because writing content requires `isAdmin()` flag which reads user record.
9.  **Relational Orphan Write (Adding content with malformed category identifier)**
    Rejected by strict regex validation or category enumeration.
10. **ID Character Poisoning (Utilizing directory traversal characters in Document IDs)**
    Blocked by `isValidId()` regex guard.
11. **Malicious Content Deletion**
    Blocked since deletion requires `isAdmin()` validation check.
12. **Denial of Wallet Recursion Exploitation**
    Rules check cheap fast primitive parameters such as `request.auth != null` first, protecting costly database reads.

## 3. Reference Test Suite structure (`firestore.rules.test.ts`)
```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

describe("SoulSync Firestore Security Rules", () => {
  it("should block non-owner edits to user profile", async () => {
    const testEnv = await initializeTestEnvironment({ projectId: "ornate-river-d8gvj" });
    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    await assertFails(aliceDb.doc("users/bob").set({ id: "bob", name: "Bob", email: "bob@edu.vn", isAdmin: false, avatarColor: "bg-red-500" }));
  });
});
```

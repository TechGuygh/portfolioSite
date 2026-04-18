# Security Specification

## Data Invariants
1. A User document must belong to the authenticated user (UID match).
2. Role assignments can only be changed by Admins.
3. Every product must have a name, retail price, and valid stock level.
4. Sales must be linked to a valid salesperson (the requester) and have at least one item.
5. PII (email) is stored in the User document and must be restricted to the owner or admin.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a user document with a different UID.
2. **Privilege Escalation**: Non-admin attempting to set their role to 'Admin'.
3. **Invalid Product Name**: Product with an empty name or very long name.
4. **Negative Pricing**: Product with a negative retail or cost price.
5. **Orphaned Sale**: Sale with a salesperson ID that doesn't match the requester.
6. **Bulk Sales Overload**: Sale with 1000 items (exceeding limit).
7. **PII Leak**: Accessing another user's profile document.
8. **Resource Poisoning**: Massive string in a document ID.
9. **Role Bypass**: Updating the role field as a regular user.
10. **Terminal State Break**: Attempting to delete a "finished" sale (if applicable, though rules currently allow admin delete).
11. **Negative Stock**: Adjusting stock to a negative value.
12. **Public Write**: Attempting to write to any collection while unauthenticated.

## Test Runner (Conceptual)
All payloads above MUST return PERMISSION_DENIED.

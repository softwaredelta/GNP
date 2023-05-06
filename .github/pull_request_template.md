**PR Data:**
Task ID: (type the id of the development activity in the plan spreadsheet)

**PR Submitter Checklist:**

- [ ] This PR completely marks as finished the related task ?
- [ ] This PR includes automated testing following these points ?
  - [ ] Backend
    - [ ] New functions that interact with the database have related tests in `__tests__/app/*`
    - [ ] New endpoints have related tests in `__tests__/controller/*`
      - [ ] Tests for authentication if needed
      - [ ] Tests for validation if needed, either for body or search parameters
  - [ ] Frontend

**PR Reviewer Checklilst:**
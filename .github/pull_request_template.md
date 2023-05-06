**PR Data:**
Task ID: (type the id of the development activity in the plan spreadsheet)

Problem: (description of what this PR is solving)

Solution: (description of how this PR solves the problem)

**PR Submitter Checklist:**

Submitter Name: (your name)

Before marking the PR as ready and asking for somehow to review it, make sure **ALL** steps
are checked. You are responsible for ensuring the answers to all questions are true.

If you make changes to the PR, you **HAVE** to make sure all steps are stil true.

- [ ] You added the development minutes to the timelog in the activity plan ?
- [ ] All required workflows pass correctly ?
- [ ] The branch/PR is in good state
  - [ ] No "137 commits"
  - [ ] No conflicts with `develop`
  - [ ] If you need help, see: https://pastebin.com/tmbHpGDF
- [ ] This PR completely marks as finished the related task ?
- [ ] This PR does absolutely no work that isn't directly related to the related task ?
- [ ] This PR conforms to the coding standards ?
  - [ ] Frontend
    - [ ] Components that concern about layout and style, are **100%** pure
- [ ] This PR includes automated testing following these points ?
  - [ ] Backend
    - [ ] New functions that interact with the database have related tests in `__tests__/app/*`
    - [ ] New endpoints have related tests in `__tests__/controller/*`
      - [ ] Tests for authentication if needed
      - [ ] Tests for validation if needed, either for body or search parameters
  - [ ] Frontend
    - [ ] Components are rendered using the `RenderTest` fixture at `fixtures.tsx` (see authentication.test.tsx for example)
    - [ ] Test isn't just a render call
- [ ] You manually tested any changes that cannot be tested in the automated tests ?
- [ ] If this PR added new features that might be useful for other developers (for example, a new API to send s3 files)
  - [ ] Did you add documentation on the root directory README.md ?
- [ ] If this PR needs new data to show how it works on staging
  - [ ] Did you add test entities in the seeds function at `seeds/index.ts` ?

**PR Reviewer Checklilst:**

Reviewer Name:

Before approving and merging the PR, make sure **ALL** steps are checked. You are
responsible for ensuring the answers to all questions are true.

If the submitter makes updates to the PR, you **MUST** go through all steps again.

- [ ] You added your name to this description in the "Reviewer name" field.
- [ ] You tested the changes locally
  - [ ] You checked out the PR locally
  - [ ] You ran the development server
  - [ ] You made sure everything starts up correctly
  - [ ] If the automated tests aren't enough, you manually confirmed the changes work as expected
  - [ ] You are sure all changes are either tested manually by you, or in automated tests
- [ ] You reviewd all changes and files manually
  - [ ] Code conforms to coding standards
- [ ] You are sure PR is ready to be merged to staging
- [ ] You are aware merging this PR will result in automatic changes to the staging deployment
- [ ] You marked your test and review minutes in the activity plan
- [ ] You approved and merged the PR

# Change Log
## Patch 2.0.1 - October 7th, 2021

### Bug Fixes

- Fixed User Add/Edit dialogs not working when no companies exist in the database
- Fixed Student pages when a student is not part of a company - (displays message to contact instructor)

## Release 2.0 - September 15th, 2021

### UPGRADING

The requirements for server/.env has changed dramatically. Look at server/template.env for examples.

NOT FOR PRODUCTION! - INSECURE
DEV_MODE has been added to the app. This allows developers or a devops team to signin using a temporary local account before the app is fully launched. This bypasses the SAML authentication system and allows the administrator to add other admins. Enable this feature by filling out the devmode section in server/.env

### NEW FEATURES

- Administrators/Instructors can now login to any Student's account on the User Management Page
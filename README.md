This is a booking system designed for the bookings that need to be done for the welcomming weeks.
The goal with this project is to make the whole process easier for everyone involved by designing a web-based booking system where each welcoming committee makes their wished bookings. The system then automatically detects clashes with other committees and and warns the user so that they can change their booking or discuss the clash with the other welcoming committee.

Because of time constrains the project currently uses React (w. context and hooks) in the frontend and firestore in the backend. Eventually it will most likely get it's own backend since there is a lot of reads and writes happening - which will get expensive when used with firestore (turns out it's not that bad). But for now it allows me to focus on a bug-free, user-friendly frontend which is very important in this case since it will actually be used by quite a few people.

### Defintition of MVP for this project:

- [x] Can sign up with with user that has a 'fadderi' assigned to it
- [x] Can log in
- [x] Can create bookings for the entierity of nolle-p that are saved to db and can be accessed later
- [x] Bookings can be modified and deleted and these changes are reflected in the db
- [x] Can see collisions with other ppls bookings in graphic overview
- [X] Can export excel sheet with own bookings
- [X] Can export excel sheet with all colliding bookings between users
- [ ] Can export all bookings across all users

### Useful commands

Horizontal scroll: shift + scroll.  
New appointment: Enter or Space.  
Delete appointment: Delete. 

# Version 2

- [x] Upgrade React to v18
- [x] Upgrade Firebase to v9
- [x] Remove option of repeating events (keeping this means I need to introduce a lot of additional logic to the collision handling, not doing that)
- [x] Only make it possible to have one public plan at a time (so that users don't create individual plans for individual events, yes, they did that)
- [x] Refactor collision code to make it more readable
- [ ] Ensure that amount of objects (bänkset etc) are correct
- [x] Fix and improve styling
- [x] Update contact email
- [ ] Add option for resetting password if forgotten

Finally - before planning starts by the new batch of welcoming committees
- [ ] Make all plans non-public
- [ ] Review accounts and remove redundant ones

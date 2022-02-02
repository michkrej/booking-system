This is a booking system designed for the bookings that need to be done for the welcomming weeks.
The goal with this project is to make the whole process easier for everyone involved by designing a web-based booking system where each welcoming commitee makes their wished bookings. The system then automatically detects clashes with other commitees and and warns the user so that they can change their booking or discuss the clash with the other welcoming commitee.

Because of time constrains the project currently uses React (w. hooks) in the frontend and firestore in the backend. Eventually it will most likely get it's own backend since there is a lot of reads and writes happening - which will get expensive when used with firestore. But for now it allows me to focus on a bug-free, user-friendly frontend which is very important in this case since it will actually be used by quite a few people.

### Defintition of MVP for this project:

- [x] Can sign up with with user that has a 'fadderi' assigned to it
- [ ] Can log in
- [x] Can create bookings for the entierity of nolle-p that are saved to db and can be accessed later
- [x] Bookings can be modified and deleted and these changes are reflected in the db
- [ ] Can export excel sheet with own bookings
- [ ] Can export excel sheet with all colliding bookings between users
- [ ] Can exprt all bookings across all users

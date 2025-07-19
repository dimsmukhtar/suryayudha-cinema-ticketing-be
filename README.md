### Api Specifications

#### Health

- **health** GET | **(ADMIN)**
- **health/db** GET | **(ADMIN)**

#### Auths
api/v1/
- **auths/login** POST | **(USER)**
```req.body = email,password```
- **auths/admin/login** POST | **(ADMIN)**
```req.body = email,password```

#### Users
api/v1/

- **users** GET | **(ADMIN)**
- **users/:id** GET | **(ADMIN)**
- **users/** POST | **(ADMIN)**
 ```req.boy = name,email,role,password,is_verified ```
- **users/:id** PATCH | **(ADMIN)**
 ```req.body = name,email,role,password,is_verified,profile_url```
- **users/:id** DELETE | **(ADMIN)**

- **users/register** POST | **(USER)**
 ```req.body = name,email,password, passwordConfirmation```
 - **users/resend-verification-token** POST | **(USER)**
```req.body = email```
- **users/verify-email** POST | **(USER)**
```req.body = email,verificationCode```
- **users/profile** GET | **(USER & ADMIN)**
- **users/update-profile** PATCH | **(USER & ADMIN)**
```req.body = name,email,profile_url```
- **users/change-password** PATCH | **(USER & ADMIN)**
```req.body = oldPassword,newPassword,newPasswordConfirmation```
- **users/forgot-password** POST | **(USER & ADMIN)**
```req.body = email```
- **users/reset-password** POST | **(USER & ADMIN)**
```req.body = passwordResetCode, newPassword, newPasswordConfirmation```
- **users/logout** POST | **(USER & ADMIN)**

#### Movies
api/v1/
- **movies/** POST | **(ADMIN)**
 ```req.body = title,synopsis,director,duration,rating,language,subtitle,poster_url,trailer_url,release_date,status,movie_genres```
- **movies/** GET | **(USER & ADMIN)**
 ```req.query = ?status&?title?genre```
- **movies/:id** GET | **(USER & ADMIN)**
- **movies/:id** PATCH | **(ADMIN)**
 ```req.body = title,synopsis,director,duration,rating,language,subtitle,poster_url,trailer_url,release_date,status,movie_genres```
- **movies/:id** DELETE | **(ADMIN)**

#### Casts
api/v1/
- **casts/** GET | **(USER & ADMIN)**
- **casts/** POST | **(ADMIN)**
 ```req.body = movie_id,actor_name,actor_url```
- **casts/:id** PATCH | **(ADMIN)**
 ```req.body = actor_name,actor_url```
- **casts/:id** DELETE | **(ADMIN)**

#### Genres
api/v1/
- **genres/** GET | **(USER & ADMIN)**
- **genres/:id** GET | **(USER & ADMIN)**
- **genres/** POST | **(ADMIN)**
 ```req.body = name```
- **genres/:id** PATCH | **(ADMIN)**
 ```req.body = name```
- **genres/:id** DELETE | **(ADMIN)**
- **genres/movie-genre** POST | **(ADMIN)**
 ```req.body = movie_id,genre_id```
- **genres/movie-genre/:id** DELETE | **(ADMIN)**

#### Notifications
api/v1/
- **notifications/** POST | **(ADMIN)**
 ```req.body = title,description,target_audience,user_id```
- **notifications/** GET | **(ADMIN)**
- **notifications/my** GET | **(USER & ADMIN)**
- **notifications/:id/my/mark** POST | **(USER & ADMIN)**
- **notifications/:id/my/hide** DELETE | **(USER & ADMIN)**


#### Studios
api/v1/
- **studios/** POST | **(ADMIN)**
 ```req.body = name```
- **studios/** GET | **(USER & ADMIN)**
- **studios/photos** GET | **(USER & ADMIN)**
- **studios/:id** GET | **(USER & ADMIN)**
- **studios/:id** PUT | **(ADMIN)**
 ```req.body = name```
- **studios/:id** DELETE | **(ADMIN)**
- **studios/:id/upload/** POST | **(ADMIN)**
 ```req.body = photos```
- **studios/photos/:id/delete** DELETE | **(ADMIN)**


#### Schedules
api/v1/
- **schedules/** POST | **(ADMIN)**
 ```req.body = start_time,price,movie_id,studio_id```
- **schedules/** GET | **(USER & ADMIN)**
- **schedules/:id** GET | **(USER & ADMIN)**
- **schedules/:id** DELETE | **(ADMIN)**
- **schedules/:id/seats** get | **(USER & ADMIN)**
- **schedules/seats/:id** PATCH | **(ADMIN)**
 ```req.body = status```

 #### Vouchers
api/v1/
- **vouchers/** POST | **(ADMIN)**
 ```req.body = code,type,value,expires_at,usage_limit,min_purchase_amount```
- **vouchers/** GET | **(ADMIN)**
- **vouchers/:id** GET | **(ADMIN)**
- **vouchers/:id** PATCH | **(ADMIN)**
 ```req.body = code,type,value,expires_at,usage_limit,min_purchase_amount```
- **vouchers/:id** DELETE | **(ADMIN)**

#### Bookings & Transactions
api/v1/
- **transactions/** POST | **(USER)**
 ```req.body = schedule_id,seat_ids example A2,A3```
- **transactions/** GET | **(ADMIN)**
- **transactions/:id/apply-voucher** PATCH | **(ADMIN)**
 ```req.body = voucher_code```
- **transactions/:id** get | **(USER & ADMIN)**
- **transactions/my** GET | **(USER)**
- **transactions/:id/pay** POST | **(USER)**
- **/api/webhooks/midtrans** POST | **(MIDTRANS)**
- **/transactions/check-status/:orderId** GET | **(ADMIN)**

#### Tickets
api/v1/
- **tickets/** GET | **(ADMIN)**
- **tickets/my** GET | **(USER)**
- **tickets/:id** GET | **(USER & ADMIN)**
- **tickets/:id** DELETE | **(ADMIN)**

#### Database Diagram
![diagram](./public/img/cinema-booking.png)
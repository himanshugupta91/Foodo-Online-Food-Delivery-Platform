# CODE STORM

1. **User:**
    - ID (Auto-generated)
    - Username
    - Password
    - Email
    - Phone Number
    - Address
    - Role (Customer or Restaurant Owner)
    - Registration Date
    - Last Login Date
2. **Restaurant:**
    - ID (Auto-generated)
    - Name
    - Description
    - Cuisine Type
    - Address
    - Contact Information
    - Opening Hours
    - Ratings
    - Image URL
    - Registration Date
3. **Menu Item:**
    - ID (Auto-generated)
    - Name
    - Description
    - Price
    - Category
    - Image URL
    - Availability Status
    - Restaurant (reference to Restaurant entity)
    - Creation Date
4. **Order:**
    - ID (Auto-generated)
    - Customer (reference to User entity)
    - Restaurant (reference to Restaurant entity)
    - Total Amount
    - Order Status
    - Timestamp
    - Delivery Address
    - Items (list of Order Items)
    - Payment (reference to Payment entity, if applicable)
5. **Order Item:**
    - ID (Auto-generated)
    - Menu Item (reference to Menu Item entity)
    - Quantity
    - Subtotal
    - Order (reference to Order entity)
6. **Payment:**
    - ID (Auto-generated)
    - Order (reference to Order entity)
    - Payment Method
    - Payment Status
    - Total Amount
    - Payment Timestamp
7. **~~Delivery Executive:~~**
    - ~~ID (Auto-generated)~~
    - ~~Name~~
    - ~~Contact Information~~
    - ~~Availability Status~~
    - ~~Current Location (Latitude and Longitude)~~
8. **Review/Rating:**
    - ID (Auto-generated)
    - Customer (reference to User entity)
    - Restaurant (reference to Restaurant entity)
    - Rating
    - Review Text
    - Timestamp
9. **Promotion/Coupon:**
    - ID (Auto-generated)
    - Code
    - Discount Amount
    - Validity Period
    - Terms and Conditions
10. **Notification:**
    - ID (Auto-generated)
    - Recipient (reference to User, Restaurant, or Delivery Executive entity)
    - Message
    - Timestamp
    - Read Status
11. **Category:**
    - ID (Auto-generated)
    - Name
12. **Address:**
    - ID (Auto-generated)
    - Street Address
    - City
    - State/Province
    - Postal Code
    - Country
    
13. contact information
    - email
    - mobile
    - twitter
    - instagram

## Backend Package Structure

The Spring Boot backend follows this layered structure:

- `com.himanshu.controller` -> REST controllers for HTTP request/response handling
- `com.himanshu.service` -> service interfaces with business rules
- `com.himanshu.service.impl` -> service implementations
- `com.himanshu.repository` -> Spring Data JPA repositories
- `com.himanshu.model.entity` -> JPA entities (database tables)
- `com.himanshu.dto.request` -> API request DTOs
- `com.himanshu.dto.response` -> API response DTOs
- `com.himanshu.dto` -> shared wrappers like `ApiResponse`
- `com.himanshu.config` -> app configuration classes
- `com.himanshu.config.security` -> JWT and Spring Security components
- `com.himanshu.exception` -> custom exceptions and global handler
- `com.himanshu.util.common` -> shared helper utilities
- `com.himanshu.mapper` -> MapStruct mappers for request/entity/response mapping

## ACID Transaction Strategy

To keep backend writes reliable and ACID-compliant, transactions are managed in the service layer:

- Service implementations default to `@Transactional(readOnly = true)` for query operations.
- Write operations (`create`, `update`, `delete`, status changes, cart/order flows) use method-level `@Transactional`.
- Methods that can throw checked business exceptions use `@Transactional(rollbackFor = Exception.class)` so partial writes are rolled back.
- Multi-step operations (for example password reset, order creation, order status update + notification) are wrapped in a single transaction boundary to preserve consistency.

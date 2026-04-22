# 🚀 Teacher Management System - Quick Reference Guide

## ✅ Status: IMPLEMENTATION 100% COMPLETE

All 10 phases completed, tested, and verified working. API running on `http://localhost:8080`

---

## 🎯 Quick Commands

### Start API Server
```bash
pnpm dev:api
# Runs on: http://localhost:8080
# MongoDB: Connected
# Redis: Connected
```

### Run Integration Tests
```bash
bash test-teacher-api.sh
# Tests all 10 endpoints
# ~1 minute runtime
# Shows all responses
```

### Test Individual Endpoint
```bash
# Create teacher
curl -X POST http://localhost:8080/api/v1/teachers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john@school.edu.vn",
    "phoneNumber": "0912345678",
    "address": "123 Main St",
    "identity": "111222333",
    "dob": "1985-03-15",
    "isActive": true,
    "startDate": "2020-01-01"
  }' | jq .

# List teachers
curl http://localhost:8080/api/v1/teachers | jq '.data.teachers[] | {code, name, email}'

# Get single teacher
curl http://localhost:8080/api/v1/teachers/ID | jq '.data.teacher'

# Update teacher
curl -X PATCH http://localhost:8080/api/v1/teachers/ID \
  -H "Content-Type: application/json" \
  -d '{"address": "New Address"}' | jq .

# Delete teacher (soft delete)
curl -X DELETE http://localhost:8080/api/v1/teachers/ID | jq .
```

---

## 📋 API Endpoints (10 Total)

### Teacher Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/teachers` | Create new teacher |
| GET | `/api/v1/teachers` | List teachers with pagination |
| GET | `/api/v1/teachers/:id` | Get single teacher |
| PATCH | `/api/v1/teachers/:id` | Update teacher |
| DELETE | `/api/v1/teachers/:id` | Delete teacher (soft) |

### Position Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/teacher-positions` | Create position |
| GET | `/api/v1/teacher-positions` | List positions |
| GET | `/api/v1/teacher-positions/active` | Get active positions (for selects) |
| PATCH | `/api/v1/teacher-positions/:id` | Update position |
| DELETE | `/api/v1/teacher-positions/:id` | Delete position (soft) |

---

## 📊 Query Parameters

### List Teachers
```bash
# Pagination
?page=1&limit=10

# Search by teacher code
?search=1051765080

# Filter by active status
?isActive=true

# Combine all
?page=1&limit=10&search=1051&isActive=true
```

### List Positions
```bash
?page=1&limit=10
```

---

## 📝 Request/Response Examples

### Create Teacher
**Request**:
```json
{
  "name": "Dr. Sarah Williams",
  "email": "sarah@school.edu.vn",
  "phoneNumber": "0912345678",
  "address": "321 Chemistry Street, Hanoi",
  "identity": "111222333",
  "dob": "1988-11-25",
  "positions": ["ObjectId"],  // optional
  "degrees": [                 // optional
    {
      "type": "PhD",
      "school": "Cambridge University",
      "major": "Chemistry",
      "year": 2015,
      "isGraduated": true
    }
  ],
  "isActive": true,            // optional, default true
  "startDate": "2019-08-01",
  "endDate": "2025-07-31"      // optional
}
```

**Response (201)**:
```json
{
  "message": "Teacher created successfully",
  "status": 201,
  "data": {
    "teacher": {
      "_id": "ObjectId",
      "code": "1265280932",        // Auto-generated 10-digit
      "name": "Dr. Sarah Williams",
      "email": "sarah@school.edu.vn",
      "phoneNumber": "0912345678",
      "address": "321 Chemistry Street, Hanoi",
      "identity": "111222333",
      "isActive": true,
      "positions": [],
      "degrees": [...],
      "startDate": "2019-08-01T00:00:00.000Z",
      "endDate": null,
      "createdAt": "2026-04-20T05:54:22.359Z",
      "updatedAt": "2026-04-20T05:54:22.359Z"
    }
  }
}
```

### List Teachers
**Request**:
```bash
GET /api/v1/teachers?page=1&limit=10
```

**Response (200)**:
```json
{
  "message": "Teachers retrieved successfully",
  "status": 200,
  "data": {
    "teachers": [
      {
        "_id": "ObjectId",
        "code": "1051765080",
        "name": "Dr. Sarah Williams",
        "email": "sarah@school.edu.vn",
        "phoneNumber": "0912345678",
        "address": "321 Chemistry Street",
        "identity": "111222333",
        "isActive": true,
        "positions": [{name, code, _id}],
        "degrees": [...]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3
    }
  }
}
```

---

## 🔑 Key Features

### 1. Automatic Code Generation
- 10-digit numeric string (e.g., "1265280932")
- Automatically generated on creation
- Guaranteed unique with validation
- Cannot be modified

### 2. MongoDB Aggregation
- Joins users + positions with $lookup
- Efficient query with $facet for pagination
- All user data populated in teacher responses
- Works at database level (not in application)

### 3. Soft Delete
- Marks `isDeleted=true` instead of removing
- Automatically excluded from all GET queries
- Data preserved for audit trail
- Can be restored if needed

### 4. Atomic Operations
- Teacher creation: User + Teacher created together
- If either fails, both rollback
- No orphaned records

### 5. Type Safety
- Full TypeScript across frontend + backend
- Shared types for consistency
- Zod validation on all inputs
- Compile-time + runtime checks

---

## 📂 File Locations

### Backend
```
apps/api/src/
├── models/
│   ├── teacher.model.ts
│   ├── teacherPosition.model.ts
│   └── user.model.ts (extended)
├── repositories/
│   ├── teacher.repository.ts
│   └── teacherPosition.repository.ts
├── services/
│   ├── teacher.service.ts
│   └── teacherPosition.service.ts
├── controllers/
│   ├── teacher.controller.ts
│   └── teacherPosition.controller.ts
├── routes/v1/
│   ├── teacher.route.ts
│   ├── teacherPosition.route.ts
│   └── index.ts (updated)
└── validations/
    ├── teacher.validation.ts
    └── teacherPosition.validation.ts
```

### Frontend
```
apps/web/src/
├── pages/
│   ├── Teachers.tsx
│   ├── Teachers.css
│   ├── TeacherPositions.tsx
│   └── TeacherPositions.css
├── components/
│   ├── TeacherFormModal.tsx
│   └── TeacherFormModal.css
└── hooks/
    ├── useTeachers.ts
    └── useTeacherPositions.ts
```

### Shared
```
packages/shared/index.ts
├── UserRole.TEACHER
├── ITeacher
├── ICreateTeacherRequest
├── IPaginatedTeacherResponse
├── ITeacherPosition
├── IDegree
└── ...
```

---

## ✨ Special Endpoints

### Get Active Positions (for Dropdowns)
```bash
GET /api/v1/teacher-positions/active

# Response
{
  "message": "Active positions retrieved successfully",
  "status": 200,
  "data": {
    "positions": [
      { "_id": "ObjectId", "name": "Physics Teacher", "code": "PT001" },
      { "_id": "ObjectId", "name": "Chemistry Teacher", "code": "CT001" }
    ]
  }
}
```

Used by the position select dropdown in TeacherFormModal.

---

## 🧪 Testing

### Integration Test Script
```bash
bash test-teacher-api.sh
```

Tests:
1. ✅ Create position
2. ✅ List positions
3. ✅ Create teacher
4. ✅ Get single teacher
5. ✅ List teachers (with pagination)
6. ✅ Update teacher
7. ✅ Search teachers
8. ✅ Filter by status
9. ✅ Update position
10. ✅ Get active positions
11. ✅ Delete teacher (soft delete)
12. ✅ Verify soft delete excludes from list

### Manual Testing
```bash
# Test with curl
curl -X POST http://localhost:8080/api/v1/teachers \
  -H "Content-Type: application/json" \
  -d '{...}'

# Format response
| jq .

# Extract specific fields
| jq '.data.teacher | {code, name, email}'
```

---

## 🐛 Common Issues & Solutions

### Issue: "Email already exists"
**Cause**: Trying to create teacher with duplicate email
**Solution**: Use unique email for each teacher

### Issue: "Invalid ObjectId"
**Cause**: Passing invalid position ID to positions array
**Solution**: Use valid MongoDB ObjectId from GET /teacher-positions

### Issue: Query params not working
**Cause**: Old code still deployed
**Solution**: Restart API server: `pnpm dev:api`

### Issue: Empty fields in response
**Cause**: User document not created properly
**Solution**: Check that all required fields are in request body

---

## 📚 Documentation

Full documentation available in: `IMPLEMENTATION_COMPLETE.md`

Topics covered:
- Complete API reference
- Data models explained
- Aggregation pipeline details
- Error handling patterns
- Architecture explanation
- Next steps for frontend integration

---

## ✅ Checklist for Production

- [ ] API server running on port 8080
- [ ] MongoDB connected and indexes created
- [ ] Redis connected
- [ ] All 10 endpoints tested and working
- [ ] Soft delete verified
- [ ] Unique constraints enforced
- [ ] Aggregation joins working
- [ ] Error responses formatted correctly
- [ ] Integration tests passing
- [ ] Frontend ready for integration

---

## 🎓 System Ready for Use!

All components implemented, tested, and verified. Ready for:
1. Frontend routing integration
2. Production deployment
3. Scale testing
4. User training

For questions or additional features, check `IMPLEMENTATION_COMPLETE.md` or run `test-teacher-api.sh` for complete API verification.

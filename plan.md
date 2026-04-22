# 📘 PLAN - Teacher Management System (MERN)

## 1. Tổng quan
Xây dựng hệ thống quản lý giáo viên với MERN Stack.

- Backend: Node.js + Express + MongoDB
- Frontend: React / Next.js
- Mục tiêu: Hoàn thành API (7đ) + UI cơ bản (3đ)

---

## 2. Ưu tiên theo điểm

### 🔴 High Priority (Backend)
- GET /teachers (join + format) – 2đ
- POST /teachers – 2đ
- Pagination – 1đ

### 🟠 Medium
- GET /teacher-positions – 1đ
- POST /teacher-positions – 1đ

### 🟡 Low Priority
- Frontend list + create form – 3đ

---

## 3. Database Design

### 3.1 users
```ts
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  phoneNumber: string,
  address: string,
  identity: string,
  dob: Date,
  role: "STUDENT" | "TEACHER" | "ADMIN",
  isDeleted: boolean
}
```

---

### 3.2 teachers
```ts
{
  _id: ObjectId,
  userId: ObjectId (ref users),
  code: string (unique, 10 digits),
  isActive: boolean,
  isDeleted: boolean,
  startDate: Date,
  endDate: Date,
  positions: ObjectId[] (ref teacher_positions),
  degrees: [
    {
      type: string,
      school: string,
      major: string,
      year: number,
      isGraduated: boolean
    }
  ]
}
```

---

### 3.3 teacher_positions
```ts
{
  _id: ObjectId,
  name: string,
  code: string (unique),
  des: string,
  isActive: boolean,
  isDeleted: boolean
}
```

---

## 4. Backend Plan

### 4.1 Structure
```
modules/
  teacher/
    teacher.controller.ts
    teacher.service.ts
    teacher.route.ts
    teacher.model.ts

  teacher-position/
```

---

### 4.2 POST /teachers

Flow:
1. Validate input
2. Check email unique
3. Generate code (10 số, unique)
4. Create user
5. Create teacher

---

### 4.3 GET /teachers

- Join user + positions
- Return:
  - code
  - name
  - email
  - phone
  - address
  - isActive
  - positions
  - degrees

👉 Nên dùng MongoDB Aggregation ($lookup)

---

### 4.4 Pagination
Query:
```
?page=1&limit=10
```

---

### 4.5 Teacher Position APIs

- GET /teacher-positions
- POST /teacher-positions (code unique)

---

## 5. Frontend Plan

### 5.1 Teacher List
- Table
- Pagination

### 5.2 Create Teacher
- Form input
- Call API

### 5.3 Teacher Position
- List + create

---

## 6. Risk & Lỗi dễ mất điểm

- Không join data
- Không unique email/code
- Không pagination
- Sai response format

---

## 27. Bonus (ăn điểm cao)

- Dùng Aggregation thay vì populate
- Validate bằng Zod
- Clean architecture (service/controller)

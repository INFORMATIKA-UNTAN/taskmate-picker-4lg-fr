[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/x2ItrsjB)
# TaskMate – Minggu 1–3

## Identitas
- Nama : Muhammad Alghifari
- NIM  : D1041221044
- Kelas: Pemrograman Perangkat Bergerak A

---

## Deskripsi Project
TaskMate adalah aplikasi **manajemen tugas sederhana** yang dibuat menggunakan **React Native (Expo Router)**.  
Proyek ini dikerjakan bertahap sesuai modul Minggu 1–3.

### Minggu 1 (TaskMate 1)
- Setup project **Expo Router Tabs** (Home, Add, Progress).
- **Home**: menampilkan daftar tugas dari **dummy data** (array statis).
- Bisa toggle status **Todo ⇆ Done** dengan `useState`.
- **Add** & **Progress** masih berupa placeholder.

### Minggu 2 (TaskMate 2)
- Tambah penyimpanan **AsyncStorage** (persisten, data tidak hilang saat aplikasi ditutup).
- **Add**: form input untuk menambah tugas (judul, deskripsi, deadline, kategori default).
- **Home**: menampilkan data dari storage, bisa **toggle status** dan **hapus tugas**.
- CRUD sederhana sudah berjalan.

### Minggu 3 (TaskMate 3)
- Tambah **kategori dinamis** (bisa tambah kategori baru dengan warna otomatis).
- Tambah **prioritas** (High, Medium, Low).
- **Home**:
  - Filter berdasarkan **status, kategori, prioritas**.
  - Sorting otomatis: **prioritas tinggi → rendah**, lalu deadline terdekat.
  - Grouping tugas berdasarkan **kategori** (pakai SectionList).
  - Menampilkan **counter Done** dan **Overdue**.
  - Tombol **Clear Done** dan **Clear All**.
- **Progress**: masih placeholder (grafik akan ditambahkan pada Minggu 5).

---

## Cara Menjalankan
1. Clone repo:
   ```sh
   git clone https://github.com/INFORMATIKA-UNTAN/taskmate-picker-<id-mhs>.git
   cd taskmate-picker-<id-mhs>
   
2. Install Dependency
   ```sh
   npm install
   npx expo install @react-native-async-storage/async-storage
   npx expo install @react-native-picker/picker
   npx expo install @expo/vector-icons
   npx expo install react-native-safe-area-context
   
3. Jalankan Aplikasi
   ```sh
   npx expo start

4. Scan QR code menggunakan aplikasi Expo Go di HP.

---

## Struktur Folder
```csharp
app/
 ├─ _layout.jsx
 ├─ index.jsx       # Home
 ├─ add.jsx         # Form tambah task
 └─ progress.jsx    # Placeholder grafik

src/
 ├─ components/
 │   ├─ TaskItem.jsx
 │   ├─ FilterToolbarFancy.jsx
 │   └─ AddCategoryModal.jsx
 ├─ constants/
 │   ├─ categories.js
 │   └─ priorities.js
 └─ storage/
     ├─ taskStorage.js
     └─ categoryStorage.js

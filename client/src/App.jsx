import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  // Fetch danh sách sinh viên (GET)
  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Lỗi kết nối API:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Xử lý Thay đổi Input Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Xử lý Thêm mới (POST) hoặc Cập nhật (PUT)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.studentId || !formData.name || !formData.email) return alert('Vui lòng nhập đầy đủ thông tin!')

    if (editingId) {
      // API PUT (Cập nhật)
      fetch(`http://localhost:5000/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          setEditingId(null)
          setFormData({ studentId: '', name: '', email: '' })
          fetchStudents()
        })
        .catch((err) => console.error(err))
    } else {
      // API POST (Thêm mới)
      fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          setFormData({ studentId: '', name: '', email: '' })
          fetchStudents()
        })
        .catch((err) => console.error(err))
    }
  }

  // Xử lý Xóa sinh viên (DELETE)
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' })
        .then(() => fetchStudents())
        .catch((err) => console.error(err))
    }
  }

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id)
    setFormData({ studentId: student.studentId, name: student.name, email: student.email })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h2>Quản Lý Sinh Viên (MERN Stack)</h2>

      {/* Form Nhập Dữ Liệu */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="studentId" placeholder="MSSV" value={formData.studentId} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Họ và Tên" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>
      </form>

      {/* Danh sách Sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {students.map((st) => (
            <li key={st._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ccc' }}>
              <span><strong>{st.studentId}</strong> - {st.name} ({st.email})</span>
              <div>
                <button onClick={() => handleEdit(st)} style={{ marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(st._id)} style={{ color: 'red' }}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
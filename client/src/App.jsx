import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  // Lấy đường dẫn API chuẩn trên GitHub Codespaces
  const API_URL = '/api/students'

  // Fetch danh sách sinh viên
  const fetchStudents = () => {
    setLoading(true)
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data)
        } else {
          setStudents([])
        }
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Reset Form
  const handleReset = () => {
    setFormData({ studentId: '', name: '', email: '' })
    setEditingId(null)
  }

  // Thêm mới hoặc Cập nhật
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.studentId || !formData.name || !formData.email) {
      return alert('Vui lòng nhập đầy đủ thông tin!')
    }

    if (editingId) {
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          handleReset()
          fetchStudents()
        })
        .catch((err) => console.error(err))
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          handleReset()
          fetchStudents()
        })
        .catch((err) => console.error(err))
    }
  }

  // Xóa sinh viên
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => fetchStudents())
        .catch((err) => console.error(err))
    }
  }

  // Chọn sửa
  const handleEdit = (student) => {
    setEditingId(student._id)
    setFormData({ studentId: student.studentId, name: student.name, email: student.email })
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Quản Lý Sinh Viên</h1>
        <p style={styles.subtitle}>MERN Stack Application - Cloud Computing Lab</p>
      </header>

      {/* Form nhập liệu */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>{editingId ? '📝 Cập Nhật Thông Tin' : '➕ Thêm Sinh Viên Mới'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              name="studentId"
              placeholder="Mã số sinh viên (MSSV)"
              value={formData.studentId}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Họ và Tên"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.btnGroup}>
            <button type="submit" style={editingId ? styles.btnUpdate : styles.btnAdd}>
              {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
            </button>
            <button type="button" onClick={handleReset} style={styles.btnCancel}>
              Làm Mới / Hủy
            </button>
          </div>
        </form>
      </div>

      {/* Bảng danh sách */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={styles.cardTitle}>📋 Danh Sách Sinh Viên</h3>
          <button onClick={fetchStudents} style={styles.btnRefresh}>🔄 Tải Lại Dữ Liệu</button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Đang tải dữ liệu...</p>
        ) : students.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Chưa có sinh viên nào trong hệ thống.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>MSSV</th>
                <th style={styles.th}>Họ và Tên</th>
                <th style={styles.th}>Email</th>
                <th style={styles.thCenter}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st._id} style={styles.tr}>
                  <td style={styles.td}><strong>{st.studentId}</strong></td>
                  <td style={styles.td}>{st.name}</td>
                  <td style={styles.td}>{st.email}</td>
                  <td style={styles.tdCenter}>
                    <button onClick={() => handleEdit(st)} style={styles.btnEdit}>✏️ Sửa</button>
                    <button onClick={() => handleDelete(st._id)} style={styles.btnDelete}>🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '850px', margin: '30px auto', padding: '0 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", color: '#333' },
  header: { textAlign: 'center', marginBottom: '25px' },
  title: { margin: 0, color: '#1e293b', fontSize: '28px' },
  subtitle: { margin: '5px 0 0', color: '#64748b', fontSize: '14px' },
  card: { backgroundColor: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
  cardTitle: { margin: '0 0 15px 0', color: '#0f172a', fontSize: '18px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
  btnGroup: { display: 'flex', gap: '10px' },
  btnAdd: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnUpdate: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancel: { backgroundColor: '#94a3b8', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' },
  btnRefresh: { backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  th: { textAlign: 'left', padding: '12px', color: '#475569', fontSize: '14px' },
  thCenter: { textAlign: 'center', padding: '12px', color: '#475569', fontSize: '14px' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px', fontSize: '14px' },
  tdCenter: { padding: '12px', textAlign: 'center' },
  btnEdit: { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: '500' },
  btnDelete: { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
}

export default App
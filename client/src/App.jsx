import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gọi API lấy danh sách sinh viên từ Backend
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
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Danh Sách Sinh Viên</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <ul>
          {students.length > 0 ? (
            students.map((student) => (
              <li key={student._id || student.studentId}>
                <strong>{student.studentId}</strong> - {student.name} ({student.email})
              </li>
            ))
          ) : (
            <p>Chưa có dữ liệu sinh viên trong CSDL.</p>
          )}
        </ul>
      )}
    </div>
  )
}

export default App
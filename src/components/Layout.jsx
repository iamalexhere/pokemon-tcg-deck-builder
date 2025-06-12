import Navbar from './Navbar';
import { AuthProvider } from '../context/AuthContext';

/**
 * Komponen Layout utama yang membungkus seluruh aplikasi
 * 
 * Komponen ini menyediakan:
 * - AuthProvider untuk state management autentikasi global
 * - Navbar yang konsisten di seluruh aplikasi
 * - Struktur tata letak dasar dengan main content
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam layout
 */
const Layout = (props) => {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        {props.children}
      </main>
    </AuthProvider>
  );
};

export default Layout;

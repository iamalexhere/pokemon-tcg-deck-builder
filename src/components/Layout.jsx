import Navbar from '../routes/Navbar';
import { AuthProvider } from '../context/AuthContext';

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

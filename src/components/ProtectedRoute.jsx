import { useNavigate } from '@solidjs/router';
import { useAuth } from '../context/AuthContext';
import { createEffect } from 'solid-js';

const ProtectedRoute = (props) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <>
      {isLoggedIn() && props.children}
    </>
  );
};

export default ProtectedRoute;

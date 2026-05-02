import React from 'react';
import { useSelector } from 'react-redux';
import UserDocs from './roles/UserDocs';
import AdminDocs from './roles/AdminDocs';
import ModDocs from './roles/ModDocs';
import HRDocs from './roles/HRDocs'; // IMPORTED
import Container from '../../components/Container';

const Docs = () => {
  const { user, type } = useSelector((state) => state.auth);

  if (type === 'user') return <UserDocs />;

  return (
    <Container>
      {user.role === 'admin' && <AdminDocs />}
      {user.role === 'mod' && <ModDocs />}
      {user.role === 'hr' && <HRDocs />} {/* UPDATED */}
    </Container>
  );
};

export default Docs;
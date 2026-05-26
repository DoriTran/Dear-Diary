import { type FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ margin: '0 0 0.5rem', color: '#5c3d4a' }}>Home</h1>
      <p style={{ margin: 0, color: '#7a5a66' }}>
        <Link to="/dev">Developer tests</Link> moved to <code>/dev</code>.
      </p>
    </div>
  );
};

export default Home;

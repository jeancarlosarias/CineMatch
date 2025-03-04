import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ padding: '50px' }}>
    <Result
      status="404"
      title="404"
      subTitle="Lo sentimos, la página que buscas no existe."
      extra={<Button type="primary"><Link to="/">Volver al inicio</Link></Button>}
    />
  </div>
);

export default NotFoundPage;

import React from 'react'

const NotFoundPage = () => {
  return (
    <div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f3f4f6',
  flexDirection: 'column',
  textAlign: 'center'
}}>
  <h1 style={{
    fontSize: '72px',
    fontWeight: 'bold',
    color: 'orange',
  }}>404</h1>
  <p style={{
    fontSize: '24px',
    fontWeight: '600',
    color: '#374151'
  }}>Page not found</p>
  <p style={{
    color: '#6b7280',
    marginTop: '8px'
  }}>The page you are looking for doesn’t exist or has been moved.</p>
</div>

  )
}

export default NotFoundPage

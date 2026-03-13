function PageContainer({ children }) {
  return (
    <main
      style={{
        padding: '2rem 1.5rem',
        textAlign: 'left',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      {children}
    </main>
  )
}

export default PageContainer


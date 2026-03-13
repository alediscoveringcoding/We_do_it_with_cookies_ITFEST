import NavBar from '../shared/NavBar'
import PageContainer from '../shared/PageContainer'

function AuthPage() {
  return (
    <>
      <NavBar />
      <PageContainer>
        <h1>Login or Register</h1>
        <p>
          For the MVP, we will use a very small form and keep the logic simple.
          Later we can plug this into Supabase auth.
        </p>
      </PageContainer>
    </>
  )
}

export default AuthPage


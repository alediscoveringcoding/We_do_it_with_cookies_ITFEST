import NavBar from '../shared/NavBar'
import PageContainer from '../shared/PageContainer'
import AssessmentStepper from '../components/AssessmentStepper'

function AssessmentPage() {
  return (
    <>
      <NavBar />
      <PageContainer>
        <h1>Career Assessment</h1>
        <p>
          Answer a few short statements to see which RIASEC traits fit you best.
        </p>
        <AssessmentStepper />
      </PageContainer>
    </>
  )
}

export default AssessmentPage


import PaymentPage from '@/components/PaymentPage'
const Username = ({ params }) => {
  
  return (
    <>
    <PaymentPage username={params.username} />
    </>
  )
}

export default Username

//  Dynamic metadata
export async function generateMetadata({ params }) {
  return {
    title: `${params.username} - Buy Me A Chai`,
    description: `Make payments to the user ${params.username}`,
  }
}
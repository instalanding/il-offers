import Checkout from './Checkout'
import Price from './Price'

const Footer = ({ campaign }: { campaign: any }) => {


  return (
    <div className='flex justify-between'>
      <Price price={campaign.price} config={campaign.config} />
      <Checkout campaign={campaign} />
    </div>
  )
}

export default Footer
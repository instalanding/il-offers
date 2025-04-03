import Price from './Price'

const Footer = ({ campaign }: { campaign: any }) => {

  return (
    <div>
      <Price price={campaign.price} config={campaign.config} />
    </div>
  )
}

export default Footer
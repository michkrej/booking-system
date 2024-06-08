import LUST_LEAF from '@/assets/LUST_LEAF.png'

export const SiteLogo = () => {
  return (
    <div className="m-2 flex items-center md:m-4">
      <img src={LUST_LEAF} alt="LUST" className="mr-2 h-8 md:h-12" />
      <span className="text-l mb-1 hidden md:block">BOKNINGSPLANERING</span>
    </div>
  )
}

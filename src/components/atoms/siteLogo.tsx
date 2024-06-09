import LUST_LEAF from '@/assets/LUST_LEAF.png'

export const SiteLogo = () => {
  return (
    <div className="flex items-center">
      <img src={LUST_LEAF} alt="LUST" className="mr-2 h-8 md:h-12" />
      <span className="hidden text-base md:block">BOKNINGSPLANERING</span>
    </div>
  )
}

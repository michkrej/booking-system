import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { color } from '../CONSTANTS'

const StyledLink = styled(Link)(() => ({
  fontSize: '0.875rem',
  color: color.secondary
}))

export default StyledLink

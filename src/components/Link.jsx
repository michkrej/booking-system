import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { secondary2 } from '../App'

const StyledLink = styled(Link)(() => ({
  fontSize: '0.875rem',
  color: secondary2
}))

export default StyledLink

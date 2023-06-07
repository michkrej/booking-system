import { render } from '@testing-library/react'
import Error from '../Error'

describe('Error', () => {
  it('renders null if no message', () => {
    const { container } = render(<Error />)
    expect(container.firstChild).toBeNull()
  })

  it('renders message', () => {
    const { getByText } = render(<Error message={'Error'} />)
    getByText('Error')
  })
})

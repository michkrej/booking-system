import { render } from '@testing-library/react'
import Success from '../Success'

describe('Success', () => {
  it('renders null if no message', () => {
    const { container } = render(<Success />)
    expect(container.firstChild).toBeNull()
  })

  it('renders message', () => {
    const { getByText } = render(<Success message={'Success'} />)
    getByText('Success')
  })
})

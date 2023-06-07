import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  const user = userEvent.setup()

  it('renders children', () => {
    const { getByText } = render(
      <Button variant={'contained'} handleClick={() => {}}>
        Button
      </Button>
    )
    getByText('Button')
  })

  it('renders contained variant', () => {
    const container = render(
      <Button variant={'contained'} handleClick={() => {}}>
        Button
      </Button>
    )
    const elem = container.getByRole('button')
    expect(elem.className).toContain('MuiButton-contained')
  })

  it('renders outlined variant', () => {
    const container = render(
      <Button variant={'outlined'} handleClick={() => {}}>
        Button
      </Button>
    )
    const elem = container.getByRole('button')
    expect(elem.className).toContain('MuiButton-outlined')
  })

  test('executes handleClick', async () => {
    const mockHandleClick = jest.fn()
    const button = render(
      <Button variant={'contained'} handleClick={mockHandleClick}>
        Button
      </Button>
    )
    await user.click(button.getByRole('button'))
    expect(mockHandleClick).toHaveBeenCalledTimes(1)
  })
})

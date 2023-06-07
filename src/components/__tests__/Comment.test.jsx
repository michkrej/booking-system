import { render } from '@testing-library/react'
import Comment from '../Comment'

describe('Comment', () => {
  it('renders child', () => {
    const { getByText } = render(
      <Comment>
        <p>Comment</p>
      </Comment>
    )
    expect(getByText('Comment')).toBeTruthy()
  })
})

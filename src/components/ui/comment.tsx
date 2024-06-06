import { ReactNode } from 'react'

const Comment = ({ children }: { children: ReactNode }) => {
  return <p className=" text-gray-500 text-xs">{children}</p>
}

export { Comment }

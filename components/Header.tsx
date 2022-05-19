import NextLink from 'next/link'
import { Link } from '@mui/material'

const Header: React.FC = () => {
  return (
    <header className="flex justify-between p-4">
      <div>
        <nav>
          <NextLink href="/" passHref>
            <Link underline="none" color="inherit" className="font-bold text-4xl">
              DBC
            </Link>
          </NextLink>
        </nav>
      </div>
      <div className="flex justify-end gap-x-4 items-center">
        <nav>
          <NextLink href="/member" passHref>
            <Link underline="hover" color="inherit" className="font-semibold text-lg">
              Member List
            </Link>
          </NextLink>
        </nav>
        <nav>
          <NextLink href="/tournament/select-member" passHref>
            <Link underline="hover" color="inherit" className="font-semibold text-lg">
              Create Tournament
            </Link>
          </NextLink>
        </nav>
      </div>
    </header>
  )
}

export default Header

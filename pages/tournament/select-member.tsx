import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Header from '../../components/Header'

type Member = {
  name: string
  tier: number
  id: string
}

type Props = {
  memberList: {
    code: string
    data: Member[] | null
  }
}

const SelectMember: NextPage<Props> = ({ memberList }) => {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState<Member[]>([])

  return (
    <div>
      <Head>
        <title>DBC - Select Tournament Member</title>
        <meta name="description" content="Select Tournament Member" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="flex flex-col items-center m-auto">
          <h1>Select Member For Tournament</h1>
          <FormControlLabel
            label="Select All"
            control={
              <Checkbox
                checked={selectedMember.length === memberList?.data?.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMember(memberList?.data || [])
                  } else {
                    setSelectedMember([])
                  }
                }}
              />
            }
          />
          <FormGroup className="grid grid-cols-3 mb-6">
            {memberList?.data?.map((val) => {
              return (
                <FormControlLabel
                  key={val.id}
                  label={val.name}
                  control={
                    <Checkbox
                      checked={!!selectedMember.find((member) => member.id === val.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMember((prev) => [...prev, val])
                        } else {
                          setSelectedMember((prev) =>
                            prev.filter((member) => member.id !== val.id)
                          )
                        }
                      }}
                    />
                  }
                />
              )
            })}
          </FormGroup>
          <div className="mb-6">Selected Member: {selectedMember.length}</div>

          <Button
            variant="contained"
            onClick={() => {
              sessionStorage.setItem('TOURNAMENT_MEMBER', JSON.stringify(selectedMember))
              router.push('/tournament/group-result')
            }}
          >
            Create Group
          </Button>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https'
  const memberList = await fetch(`${protocol}://${req.headers.host}/api/member`).then(
    (res) => res.json()
  )

  return {
    props: {
      memberList,
    },
  }
}

export default SelectMember

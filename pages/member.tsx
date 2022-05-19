import type { GetServerSideProps, NextPage } from 'next'
import cx from 'classnames'
import Head from 'next/head'
import StarIcon from '@mui/icons-material/Star'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
} from '@mui/material'

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

type MemberProps = {
  number: number
  isEdit?: boolean
  name: string
  tier: number | null
  onSubmit?: (param: { name: string; tier: number }) => void
  onCancel?: () => void
  onDelete?: () => void
}

const getBaseURL = () => {
  return `${window.location.protocol}://${window.location.host}`
}

const TIER_OPTIONS = [1, 2, 3]

const MemberItem: React.FC<MemberProps> = ({
  number,
  isEdit = false,
  name = '',
  tier = 0,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const [memberName, setMemberName] = useState(name)
  const [memberTier, setMemberTier] = useState(tier ?? 0)
  const [isEditting, setIsEditting] = useState(isEdit)
  const [error, setError] = useState({ name: '', tier: '' })

  const hasError = error.name || error.tier

  return (
    <div
      className={cx('grid gap-x-3', {
        'grid-cols-[12px_200px_130px_auto_auto]': isEditting,
        'grid-cols-[12px_100px_100px_auto_auto]': !isEditting,
        'items-center': !hasError,
      })}
    >
      <span className={hasError ? 'mt-4' : ''}>{number}.</span>
      {isEditting ? (
        <TextField
          label="Name"
          variant="outlined"
          value={memberName}
          onChange={(e) => {
            if (error.name) {
              setError((prev) => ({ ...prev, name: '' }))
            }
            setMemberName(e.target.value)
          }}
          error={!!error.name}
          helperText={error.name}
        />
      ) : (
        <span>{memberName}</span>
      )}
      {isEditting ? (
        <FormControl error={!!error.tier}>
          <InputLabel id={`name-${number}`}>Tier</InputLabel>
          <Select
            labelId={`name-${number}`}
            label="Tier"
            value={memberTier ?? 0}
            onChange={(e) => {
              if (error.tier) {
                setError((prev) => ({ ...prev, tier: '' }))
              }
              setMemberTier(e.target.value as number)
            }}
            className="w-32"
          >
            <MenuItem value={0}>Select Tier</MenuItem>
            {TIER_OPTIONS.map((val) => {
              return (
                <MenuItem key={val} value={val} className="w-32">
                  {[...Array(val)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </MenuItem>
              )
            })}
          </Select>
          <FormHelperText>{error.tier}</FormHelperText>
        </FormControl>
      ) : (
        <div>
          {[...Array(memberTier)].map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
      )}
      {isEditting && (
        <>
          <Button
            variant="contained"
            color="success"
            className={hasError ? 'self-start mt-2' : ''}
            onClick={() => {
              if (memberName.length && memberTier > 0) {
                onSubmit?.({ name: memberName, tier: memberTier })
                setIsEditting(false)
              } else {
                const nameError = memberName.length ? '' : 'Required'
                const tierError = memberTier > 0 ? '' : 'Required'

                setError({ name: nameError, tier: tierError })
              }
            }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            color="warning"
            className={hasError ? 'self-start mt-2' : ''}
            onClick={() => {
              onCancel?.()
              setIsEditting(false)
            }}
          >
            Cancel
          </Button>
        </>
      )}
      {!isEditting && (
        <>
          <IconButton onClick={() => setIsEditting(true)} className="justify-self-center">
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} className="justify-self-center">
            <DeleteForeverIcon />
          </IconButton>
        </>
      )}
    </div>
  )
}

const Member: NextPage<Props> = ({ memberList }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [memberData, setMemberData] = useState(memberList?.data || [])

  return (
    <div>
      <Head>
        <title>DBC - Member List</title>
        <meta name="description" content="Member List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="flex flex-col justify-center items-center pt-10">
          <h1 className="font-bold text-3xl mb-8">Member List</h1>
          {!isAdding && (
            <Button
              color="primary"
              variant="contained"
              className="mb-8"
              onClick={() => setIsAdding(true)}
            >
              Add Member
            </Button>
          )}

          {isAdding && (
            <div className="mb-8">
              <MemberItem
                number={memberData?.length + 1}
                name=""
                tier={0}
                isEdit
                onSubmit={async (newMember) => {
                  await fetch(`${getBaseURL()}/api/member`, {
                    method: 'POST',
                    body: JSON.stringify({
                      name: newMember.name,
                      tier: newMember.tier,
                    }),
                  })

                  const newData = await fetch(`${getBaseURL()}/api/member`).then((res) =>
                    res.json()
                  )

                  setMemberData(newData.data)
                  setIsAdding(false)
                }}
                onCancel={() => {
                  setIsAdding(false)
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-y-4 mb-8">
            {memberData.map((val, i) => {
              return (
                <MemberItem
                  key={val.id}
                  number={i + 1}
                  name={val.name}
                  tier={val.tier}
                  onSubmit={async (editedData) => {
                    await fetch(`${getBaseURL()}/api/member`, {
                      method: 'PUT',
                      body: JSON.stringify({ ...editedData, id: val.id }),
                    })

                    const newData = await fetch(`${getBaseURL()}/api/member`).then(
                      (res) => res.json()
                    )

                    setMemberData(newData.data)
                  }}
                  onDelete={async () => {
                    await fetch(`${getBaseURL()}/api/member`, {
                      method: 'DELETE',
                      body: JSON.stringify({ id: val.id }),
                    })

                    const newData = await fetch(`${getBaseURL()}/api/member`).then(
                      (res) => res.json()
                    )

                    setMemberData(newData.data)
                  }}
                />
              )
            })}
          </div>
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

export default Member

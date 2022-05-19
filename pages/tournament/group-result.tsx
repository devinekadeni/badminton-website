import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'

type Member = {
  name: string
  tier: number
  id: string
}

type GroupedMember = { tier1: Member[]; tier2: Member[]; tier3: Member[] }

type Pair = {
  [key: number]: [string, string]
} | null

function shuffle(array: Member[]) {
  var m = array.length,
    t,
    i

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--)

    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }

  return array
}

const shuffleGroupResult = () => {
  const allMember: Member[] =
    typeof window === 'undefined'
      ? []
      : JSON.parse(sessionStorage.getItem('TOURNAMENT_MEMBER') || '') || []
  const { tier1, tier2, tier3 } = allMember.reduce(
    (prev: GroupedMember, member) => {
      return {
        ...prev,
        tier1: member.tier === 1 ? [...prev.tier1, member] : prev.tier1,
        tier2: member.tier === 2 ? [...prev.tier2, member] : prev.tier2,
        tier3: member.tier === 3 ? [...prev.tier3, member] : prev.tier3,
      }
    },
    { tier1: [], tier2: [], tier3: [] }
  )

  const pair: Pair = {}
  let counter = 1

  for (let i = 0; i < tier1.length; i++) {
    const memberTier1 = tier1[i]
    const memberTier3Or2 = tier3.length
      ? shuffle(tier3).splice(0, 1)[0]
      : shuffle(tier2).splice(0, 1)[0]
    pair[counter] = [memberTier1.name, memberTier3Or2.name]
    counter++
  }

  if (tier3.length > 0) {
    for (let i = 0; i < tier3.length; i++) {
      const memberTier3 = tier3[i]
      const memberTier2 = shuffle(tier2).splice(0, 1)[0]
      pair[counter] = [memberTier3.name, memberTier2.name]
      counter++
    }
  }

  const remainingMember = shuffle([...tier2, ...tier3])

  for (let i = 0; i < remainingMember.length; i += 2) {
    const member1 = remainingMember[i]
    const member2 = remainingMember[i + 1]
    pair[counter] = [member1.name, member2.name]
    counter++
  }

  return pair
}

const GroupResult: NextPage = () => {
  const router = useRouter()
  const [groupResult, setGroupResult] = useState<Pair>(null)

  useEffect(() => {
    const newResult = shuffleGroupResult()
    setGroupResult(newResult)
  }, [])

  return (
    <div>
      <Head>
        <title>DBC - Tournament Group Result</title>
        <meta name="description" content="Tournament Group Result" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="flex flex-col items-center m-auto">
          <h1>Select Member For Tournament</h1>
          <div className="grid grid-cols-3 gap-8 mb-6">
            {groupResult
              ? Object.entries(groupResult).map(([number, memberPair]) => {
                  return (
                    <div key={number}>
                      <b>{`${number}. ${memberPair[0]} & ${memberPair[1]}`}</b>
                    </div>
                  )
                })
              : null}
          </div>

          <Button
            variant="contained"
            onClick={() => {
              const newResult = shuffleGroupResult()

              setGroupResult(newResult)
            }}
          >
            Reshuffle
          </Button>
        </div>
      </main>
    </div>
  )
}

export default GroupResult

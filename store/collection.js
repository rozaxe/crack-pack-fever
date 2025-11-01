import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { SETS } from '../src/sets'
import { keyBy } from 'lodash-es'

const db = new Dexie('CardCollection')

db.version(1).stores({
    cards: '&card, set, foilCount, nonFoilCount',
    packs: '&set, count',
})

export function useListCollectedCard(set) {
    return useQuery({
        queryKey: ['cards', set],
        queryFn: async () => {
            const arr = await db.cards.where('set').equals(set).toArray()
            return keyBy(arr, 'card')
        },
        placeholderData: keepPreviousData
    })
}

export function usePackCount(set) {
    return useQuery({
        queryKey: ['packs', set],
        queryFn: async () => {
            const row = await db.packs.where('set').equals(set).first()
            return row?.count ?? 0
        }
    })
}

export function usePutCollectionCards() {
    return useCallback(async (printedCards) => {

        for await (const printedCard of printedCards) {
            console.log('rr', printedCard)
            const collectedCard = await db.cards.where('card').equals(printedCard.uuid).toArray()

            if (collectedCard.length === 1) {
                await db.cards.update(
                    printedCard.uuid,
                    {
                        foilCount: collectedCard[0].foilCount + (printedCard.isFoil ? 1 : 0),
                        nonFoilCount: collectedCard[0].nonFoilCount + (printedCard.isFoil ? 0 : 1),
                    }
                )
            } else {
                await db.cards.add({
                    card: printedCard.uuid,
                    set: printedCard.setCode,
                    foilCount: printedCard.isFoil ? 1 : 0,
                    nonFoilCount: printedCard.isFoil ? 0 : 1,
                })
            }
        }

    }, [])
}

export function useAddPack() {
    return useCallback(async (set) => {
        const sets = await db.packs.where('set').equals(set).toArray()
        if (sets.length === 1) {
            await db.packs.update(
                set,
                {
                    count: sets[0].count + 1
                }
            )
        } else {
            await db.packs.add({
                set,
                count: 1
            })
        }
    }, [])
}

export function useSetQuery(code) {
    return useQuery({
        queryFn: () => fetch(SETS[code].cards).then(r => r.json()),
        queryKey: ['set', code]
    })
} 

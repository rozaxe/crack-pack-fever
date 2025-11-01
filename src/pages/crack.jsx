import { useQueryClient } from "@tanstack/react-query"
import { useLayoutEffect, useRef, useMemo, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card } from "../components/Card"
import { useAddPack, usePutCollectionCards, useSetQuery } from "../../store/collection"
import clsx from "clsx"
import { randomInt } from "../lib/random"
import { cloneDeep, range, shuffle } from "lodash-es"

export function CrackPage() {
    const { code } = useParams()
    const [seed, setSeed] = useState(() => 42)
    const [collecting, setCollecting] = useState(false)
    const ref = useRef()
    const [disabled, setDisabled] = useState(false)

    const offset = useMemo(() => {
        return Math.round(Math.random() * 200);
    }, [seed])

    const setQuery = useSetQuery(code)

    const handleRedo = () => {
        if (disabled) return

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        setCollecting(true)
        setDisabled(true)

        setTimeout(() => {
            setSeed(n => n + 1)
            setCollecting(false)
        }, 350)

        setTimeout(() => {
            setDisabled(false)
        }, 2000)
    }

    if (!setQuery.isSuccess) {
        return (
            <div className="p-2">
                <span className="loading loading-ring loading-xl"></span>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1">
            <div className={clsx(collecting ? "collecting" : '', 'flex-1 overflow-hidden')}>
                <Pack code={code} seed={seed} set={setQuery.data} />
            </div>
            <div ref={ref} id="origin" className="sticky bottom-[200px] left-[50%] w-0 h-0 bg-red-500" />
            <button className={clsx("z-1 self-center w-full bg-indigo-500 px-5 py-3 z-1 text-white text-bold shadow-lg/50 flex flex-row items-center gap-2 justify-center", disabled && 'bg-slate-400', !disabled && 'cursor-pointer hover:bg-indigo-600')} onClick={handleRedo}>
                {disabled && <span className="loading loading-spinner loading-md"></span>}
                Crack another pack !
            </button>
        </div>
    )
}

function Pack({ code, seed, set }) {
    const boosterCards = useMemo(() => generatePack(set), [seed])
    return <CrakedBooster key={seed} code={code} cards={boosterCards} />
}

function generatePack(set) {

    let commons = set.filter(c => c.slot === 'common' && c.boosterWeight > 0 && (c.hasFoil === 0 || c.hasNonFoil === 1))
    let uncommons = set.filter(c => c.slot === 'uncommon' && c.boosterWeight > 0 && (c.hasFoil === 0 || c.hasNonFoil === 1))
    let raresAndMythics = set.filter(c => (c.slot === 'rare' || c.slot === 'mythic') && c.boosterWeight > 0 && (c.hasFoil === 0 || c.hasNonFoil === 1))
    let lands = set.filter(c => c.slot === 'land' && c.boosterWeight > 0 && (c.hasFoil === 0 || c.hasNonFoil === 1))
    let wildcardsNonFoil = set.filter(c => c.hasFoil === 0 || c.hasNonFoil === 1)
    let wildcardsFoil = set.filter(c => c.hasFoil === 1)

    const getRandomCard = (cards) => {
        if (cards.length === 0) return

        const boosterCumWeight = cards.reduce((acc, c) => acc + c.boosterWeight, 0)

        const rand = randomInt(1, boosterCumWeight)

        let currentCumWeight = 0

        for (let c of cards) {
            if (rand <= currentCumWeight) return c
            currentCumWeight += c.boosterWeight
        }

        return null
    }

    const getAndRemoveRandomCard = (cards) => {
        const randomCard = getRandomCard(cards)
        if (randomCard == null) return [null, cards]
        return [randomCard, cards.filter(c => c.uuid !== randomCard.uuid)]
    }

    const probas = range(1, 15).map(i => {
        let card = null
        let forceFoiled = false

        if (1 <= i && i <= 7) {
            const pair = getAndRemoveRandomCard(commons)
            commons = pair[1]
            card = pair[0]
        }

        if (8 <= i && i <= 10) {
            const pair = getAndRemoveRandomCard(uncommons)
            uncommons = pair[1]
            card = pair[0]
        }

        if (i === 11) {
            card = getRandomCard(raresAndMythics)
        }

        if (i === 12) {
            card = getRandomCard(lands)
        }

        if (i === 13) {
            card = wildcardsNonFoil[randomInt(1, wildcardsNonFoil.length) - 1]
        }

        if (i === 14) {
            card = wildcardsFoil[randomInt(1, wildcardsFoil.length) - 1]

            if (card != null) {
                forceFoiled = true
            }
        }

        const printedCard = cloneDeep(card)

        if (forceFoiled || printedCard.hasNonFoil === 0) {
            printedCard.isFoil = true
        }

        return printedCard
    })

    const cards = probas.filter(c => !!c)

    console.log('oo', cards)

    return shuffle(cards)
}

function CrakedBooster({ code, cards }) {
    const queryClient = useQueryClient()
    const putCollectionCards = usePutCollectionCards()
    const addPack = useAddPack()

    useEffect(() => {
        const execute = async () => {
            await putCollectionCards(cards)
            await addPack(code)
            queryClient.invalidateQueries(['cards', code])
        }
        execute()
    }, [])

    return (
        <div className="p-4 flex flex-col items-center sm:flex-row flex-wrap">
            {cards.map((c, i) => <RevealingCard key={i} card={c} index={i} />)}
        </div>
    )

}

function RevealingCard({ card, index }) {
    const ref = useRef()

    useLayoutEffect(() => {
        if (!ref.current) return

        const cardRect = ref.current.getBoundingClientRect()
        const originRect = document.querySelector('#origin').getBoundingClientRect()

        const x = originRect.left - cardRect.left - (cardRect.width / 2)
        const y = (originRect.top + window.scrollX) - cardRect.top - (cardRect.height / 2)

        ref.current.style.setProperty('--x', `${x}px`)
        ref.current.style.setProperty('--y', `${y + index * 20}px`)
    }, [])

    useEffect(() => {
        if (!ref.current) return

        const timeout = setTimeout(() => {
            if (!ref.current) return

            ref.current.classList.add('transition-transform')
            ref.current.classList.add('duration-300')
            ref.current.classList.add('ease-out')
            ref.current.style.removeProperty('--x')
            ref.current.style.removeProperty('--y')
            ref.current.style.setProperty('--back-opacity', '0%')
            ref.current.style.setProperty('--effect', '100%')
        }, 500 + index * 75)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return (
        <div ref={ref} className="relative transform-[translateX(var(--x))_translateY(var(--y))]">
            <Card isFoil={card.isFoil ?? false} card={card} interactive withEffect withGuard withDisplay withPreload />
        </div>
    )
}

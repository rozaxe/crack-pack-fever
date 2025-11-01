import clsx from 'clsx'
import useIntersectionObserver from '@react-hook/intersection-observer'
import { useMemo, useRef } from 'react'

/**
 * Whole card (width, height)
 * @returns [
    [
        252,
        351
    ],
    [
        280,
        390
    ],
    [
        308,
        429
    ],
    [
        336,
        468
    ]
]
 */

export function Card({ card, isFoil, interactive, withEffect, withGuard, withPreload, withDisplay, foilIndicator = 0, nonFoilIndicator = 0 }) {
    const boundingRef = useRef(null)
    const cardContainerRef = useRef(null)
    const cardRef = useRef(null)
    const isEverIntersecting = useRef(false)

    const { isIntersecting } = useIntersectionObserver(cardContainerRef)

    if (isIntersecting) {
        isEverIntersecting.current = true
    }

    const handleMouseLeave = () => {
        boundingRef.current = null
    }

    const handleMouseEnter = (ev) => {
        boundingRef.current = ev.currentTarget.getBoundingClientRect()
    }

    const handleMouseMove = (ev) => {
        if (!boundingRef.current || !cardRef.current) return

        const x = ev.clientX - boundingRef.current.left
        const y = ev.clientY - boundingRef.current.top
        const xPercentage = x / boundingRef.current.width
        const yPercentage = y / boundingRef.current.height
        const xRotation = (xPercentage - 0.5) * 20
        const yRotation = (0.5 - yPercentage) * 20

        cardRef.current.style.setProperty("--x-rotation", `${yRotation}deg`)
        cardRef.current.style.setProperty("--y-rotation", `${xRotation}deg`)
        cardRef.current.style.setProperty("--x", `${xPercentage * 100}%`)
        cardRef.current.style.setProperty("--y", `${yPercentage * 100}%`)
    }

    return (
        <div className="flex flex-row">
            <div
                ref={cardContainerRef}
                className={clsx("card-container transition-[transform_opacity] duration-250 [perspective:1500px]", interactive && 'card-interactive')}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
            >
                <div
                    ref={cardRef}
                    className={clsx("card relative w-[308px] h-[429px] transform-[scale(calc(252/308))] transition-transform ease-out bg-gray-200", withEffect && card.rarity === 'rare' && 'card-rare', withEffect && card.rarity === 'mythic' && 'card-mythic', withEffect && ['bonus', 'special'].includes(card.rarity) && 'card-weird')}
                >
                    <div className={clsx('card-inner w-full h-full rounded-[4.75%/3.5%] overflow-hidden shadow-lg/30', interactive && isFoil && 'foiled')}>
                        <div className="absolute top-[50%] left-[50%] text-3xl text-gray-400 pt-serif-bold -translate-[50%] -z-1">#{String(card.number).padStart(3, '0')}</div>
                        {withDisplay && (isEverIntersecting.current || withPreload) && <img src={card.frontImageUrl} />}
                        {withGuard && <img src="https://backs.scryfall.io/normal/0/a/0aeebaf5-8c7d-4636-9e82-8c27447861f7.jpg" className="rounded-[4.75%/3.5%] overflow-hidden pointer-events-none opacity-[var(--back-opacity)] bg-gray-500 absolute inset-0" />}
                    </div>
                </div>
                <div className="absolute flex flex-col top-25 right-3 gap-2">
                    {nonFoilIndicator > 0 && (
                        <div className="card-indicator transition-opacity px-2 py-0.5 text-sm whitespace-nowrap text-gray-700 bg-slate-50 rounded-[1.3333em/4em] border border-black border-3 ring ring-white inset-shadow-xs inset-shadow-slate-900/40">
                            <div className="pt-serif-regular w-[3ch] text-center">{nonFoilIndicator > 99 ? '+99' : nonFoilIndicator}</div>
                        </div>
                    )}
                    {foilIndicator > 0 && (
                        <div className="card-indicator foiled transition-opacity relative px-2 py-0.5 text-sm whitespace-nowrap text-gray-700 bg-slate-50 rounded-[1.3333em/4em] border border-black border-3 ring ring-white inset-shadow-xs inset-shadow-slate-900/40">
                            <div className="pt-serif-regular w-[3ch] text-center">{foilIndicator > 99 ? '+99' : foilIndicator}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// box-shadow: violet 0px -4px 12px 4px;
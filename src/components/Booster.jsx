import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const KEYFRAMES = [
    'rotateY(-30deg) rotateX(5deg)',
    'rotateY(-10deg) rotateX(5deg)',
]

export function Booster({ set }) {
    const [keyframe, setKeyframe] = useState(0)

    useEffect(() => {

        const next = () => {
            setKeyframe(x => (x + 1) % KEYFRAMES.length)
        }

        const interval = setInterval(next, 4000)

        next()

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <Link to={`/crack/${set.code}`}>
            <div className="booster-container relative h-75 w-55 flex flex-col items-center justify-center cursor-pointer">
                <div className="booster transform-3d" style={{ 'transform': KEYFRAMES[keyframe] }}>
                    <Box set={set} />
                </div>
            </div>
        </Link>
    )
}

function Box({ set }) {
    return (
        <div className="w-40 h-60 transform-3d">
            <div className={"absolute w-40 h-60 translate-z-5 rotate-x-0 flex flex-col items-center bg-stone-200"} style={{ background: set?.background }}>
                {/*1*/}
                <img className="absolute w-30 top-6" src={set?.mtg ?? '/mtg_black.png'} />

                <div className="absolute left-20 top-26 -translate-x-[50%] -translate-y-[50%]">
                    <i className={clsx("ss ss-3x ss-fw", set.keyrune)} style={{ color: set.rune }} />
                </div>

                {set?.cover ? <img className="absolute bottom-6" src={set.cover} style={{ width: set?.width, bottom: set?.bot ?? '24px' }} /> : <></>}

                <div className="absolute bottom-3 w-full h-7 font-thin text-center bg-stone-800" style={{ color: set?.text ?? 'white', background: set?.strip }}>
                    PLAY BOOSTER
                </div>
            </div>

            <div className="absolute inset-0 -translate-z-5 rotate-y-0 bg-stone-200" style={{ background: set?.background }}>
                {/*2*/}
                <div className="absolute bottom-3 w-full h-7 bg-stone-800" style={{ background: set?.strip}} />
            </div>

            <div className="absolute w-10 h-60 translate-x-35 rotate-y-90 bg-stone-300" style={{ background: set?.background }}>
                {/*3*/}
                <div className="absolute bottom-3 w-full h-7 bg-stone-800" style={{ backgroundColor: set?.strip }} />
                <div className="absolute inset-0 bg-blue-900/20" />
            </div>


            <div className="absolute w-10 h-60 -translate-x-5 -rotate-y-90 bg-stone-100" style={{ background: set?.background }}>
                {/*4*/}
            </div>

            <div className="absolute w-40 h-10 -translate-y-5 rotate-x-90 bg-stone-100"  style={{ background: set?.bottom }}>
                {/*5*/}
            </div>

            <div className="absolute w-40 h-10 translate-y-55 -rotate-x-90 bg-stone-300" style={{ background: set?.bottom }}>
                {/*6*/}
                <div className="absolute inset-0 bg-blue-900/40" />
            </div>
        </div>
    )
}

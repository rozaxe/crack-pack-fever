import { useMemo, useRef } from 'react'
import { range, sampleSize } from 'lodash-es'
import clsx from 'clsx'
import useSize from '@react-hook/size'
import { SET_ORDER, SETS } from '../sets'

const KEYRUNE_WIDTH = 88
const KEYRUNE_HEIGHT = 80
const KEYRUNE_COUNT = 6

export function Background({ className, children }) {
    const target = useRef(null)
    const [width, height] = useSize(target)

    const x = Math.ceil(width / KEYRUNE_WIDTH)
    const y = Math.ceil(height / KEYRUNE_HEIGHT) + 1

    const keyrunes = useMemo(() => sampleSize(SET_ORDER, KEYRUNE_COUNT).map(c => SETS[c].keyrune), [])

    return (
        <div className={clsx(className, "relative flex flex-col")}>
            <div className="@container -z-1 pointer-events-none overflow-hidden bg-gray-100 absolute inset-0">
                <div ref={target} className="pointer-events-none absolute inset-0 flex flex-col">
                    {range(y).map(j => (
                        <div key={j} className={clsx("flex flex-row items-center py-4 justify-center")}>
                            {j % 2 === 1 && <Keyrune key={`j-${0}`} /> }
                            {range(x).map(i => (
                                <Keyrune keyrune={keyrunes[(j * 2 + i) % KEYRUNE_COUNT]} key={i} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {children}
        </div>
    )
}

function Keyrune({ className, keyrune }) {
    return (
        <div className={clsx(className, 'shrink-0 w-22 text-center')}>
            <i className={clsx('ss ss-3x ss-fw text-gray-200', keyrune)}></i>
        </div>
    )
}

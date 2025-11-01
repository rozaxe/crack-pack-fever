import clsx from "clsx"
import dayjs from 'dayjs'
import { keys } from "lodash-es"
import { useListCollectedCard } from "../../store/collection"


export function CollectionButton({ set }) {
    return (
        <div className="collection-button relative cursor-pointer w-[300px] mr-[32px] sm:mr-0">
            <div className="collection-arrow absolute right-[-32px] sm:right-0 w-20 h-[98%] top-[1%] pr-1 flex items-center justify-end bg-emerald-500 rounded-r-[1.3333em_4em] text-white text-xl font-bold border border-emerald-600 border-l-0 border-t-0 border-r-2 border-b-5 -z-1 transition">
                <i className="ss ss-2x ss-lea transition rotate-[70deg] sm:rotate-0"></i>
            </div>
            <div className="px-4 py-1 bg-slate-300 rounded-[1.3333em/4em] border border-slate-300 inset-ring inset-ring-2 inset-ring-slate-100">
                <div className="flex flex-col gap-2 py-2 overflow-hidden">
                    <div className="pt-serif-regular self-center text-center w-full overflow-hidden text-ellipsis whitespace-nowrap truncate pt-serif-bold">
                        {set.name}
                    </div>
                    <div className="flex justify-between flex-row items-baseline gap-2">
                        <div className="self-center flex flex-row gap-2 items-center">
                            <i className={clsx("ss ss-fw", set.keyrune)} />
                            <div className={"text-xs rounded-full text-slate-800 bg-slate-200 px-2 py-0.5"}>{set.code}</div>
                        </div>
                        <div className="pt-serif-regular overflow-hidden text-ellipsis whitespace-nowrap truncate">{dayjs(set.releasedDate).format('D MMM YY')}</div>
                        <SetStats set={set} />
                    </div>
                </div>
            </div>
            <CompleteStats set={set} />
        </div>
    )
}

function SetStats({ set }) {
    const collection = useListCollectedCard(set.code)

    if (!collection.isSuccess) {
        return <></>
    }
    
    const setCount = set?.cardCount ?? 0
    const collectionCount = keys(collection.data).length

    return (
        <div className="pt-serif-regular px-2 py-0.5 text-sm whitespace-nowrap text-gray-700 bg-slate-50 rounded-[1.3333em/4em] inset-shadow-xs inset-shadow-slate-900/40">
            {collectionCount} / {setCount}
        </div>
    )
}


function CompleteStats({ set }) {
    const collection = useListCollectedCard(set.code)

    if (!collection.isSuccess) {
        return <></>
    }

    const setCount = set?.cardCount ?? 0
    const collectionCount = keys(collection.data).length

    if (collectionCount < setCount) return <></>

    return (
        <div className="absolute -bottom-3 left-[50%] -translate-x-[50%]">
            <div className="pt-serif-bold px-2 py-0.5 text-sm whitespace-nowrap text-primary-content bg-primary rounded-[1.3333em/4em] border border-white broder-2 shadow-md">
                Complete
            </div>
        </div>
    )
}

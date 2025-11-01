
export function AboutPage() {
    return (
        <div className="flex flex-col self-center prose m-8 py-8 px-8 gap-8 bg-white border border-gray-100 border-3 ring ring-2 ring-white rounded-lg w-full max-w-[640px]">
            <h1 className="font-title text-3xl font-bold">
                About
            </h1>

            <p><span className="italic">Crack Pack Fever</span> purpose is to scratch the joy of opening booster without having to spend huuuuge amount of money into it.</p>

            <h2 className="font-title text-2xl font-bold">Goal</h2>

            <p>My goal when developing <span className="italic">Crack Pack Fever</span> was to be able to get all's cards from a given set. I started my MTG collection with Innistrad and Kaladesh, which I'm fond of, but I couldn't get all the cards, because... well, it's too expensice !</p>

            <p>So, why not trying the recreate the pleasure of hoarding cards ? That's why I developed this app !</p>


            <h2 className="font-title text-2xl font-bold">Technical</h2>

            <p>This app is not really accurate. Some pack contains more card than in a real pack (like ACR), and some pack are missing some card type (like island). Maybe I will try to make it more accurate, but don't expect too much.</p>

            <p>Data is gathered from <a className='underline' href='https://mtgjson.com/'>MTGJSON</a>, <a className='underline' href='https://scryfall.com/'>Scryfall</a> and <a className='underline' href='https://mtgen.net/'>mtgen</a>. A hude thank you, because without them, I couldn't develop this app !</p>

            <h2 className="font-title text-2xl font-bold">Probabilites</h2>

            <p>Pack contains 14 cards. 7 commons, 3 uncommon, 1 rare or mythic, 1 land, 1 non foil wildcard and 1 foil wildcard ! Like an almost regular Play booster.</p>

            <h2 className="font-title text-2xl font-bold">Why is there only 10 packs available ?</h2>

            <p>I think you are on mobile, and mobiles cannot handle too much packs. So I limited them to 10 on mobile. But on desktop everything is available ! (no cross-save however...)</p>
            
            <h2 className="font-title text-2xl font-bold">Conclusion</h2>

            <p>I hope you will enjoy it as I do, because, for me, the goal is reached !</p>

            <div className='self-center font-medium'>
                Made with ❤️ by <a className='underline' href='https://github.com/rozaxe'>rozaxe</a>
            </div>
        </div>
)
}

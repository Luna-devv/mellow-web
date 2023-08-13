# Why a new version
**last modified 04/13/2023 (MM/DD/YYYY)**

The current version of @waya (v2, or also referenced as waya.ts) started development on __June 11th 2022__ using <:typescript:1073953098772529222> **Typescript** as programming language and <:MongoDB:1112259921220751360> **Mongodb** as database.

<br />

As Waya grew to more and more servers, we’ve received more “`This interaction failed`”  issues occurring, this was because of our database having a latency of 3 seconds or more, which should me sub 0.1 second (<100ms) and the [CPU usage going to 100%](<https://c.lunish.nl/r/Ef5W4N.png>) on all 6 cores. The original solution was a way to cache the database locally in the bots memory space to speed up database requests, but this only partially solved the issue. Yes it solved the database’s latency on cached responses but it didn’t at all on not cached responses, even though the servers CPU usage dropped from 100% on 6 cores to an average of 21%. But that caching also made up a new issue, [the ram usage](<https://c.lunish.nl/r/Z49rrv.png>), not only is [Waya using up to 10% (1.2gb) ram per shard](<https://c.lunish.nl/r/SQtMxT.png>) but also [MongoDB is using 16% (1.2gb)](https://c.lunish.nl/r/PCSW8A.png).

<br />

Additional to the database issue, Waya suffered a huge issue with the /config command due to it having more than 9.000 lines of code, having redundant code and just being a pain to work on, plus code and quality was really inconsistent across the whole source code (both Waya bot and Waya web).

<br />

After this all I came to the following conclusions:
- Fuck am I a bad developer
- The code out grew it’s user base
- Commands do not work for setup
- A rewrite has to come


#  The rewrite to Waya v3
On the __2nd of July__ I’ve started with the development of v3, code named [mwya](<https://wamellow.com>), @wamellow. It still uses <:typescript:1073953098772529222> **Typescript** as programming language but <:postgres:1073953306667397161> **PostgreSQL** as a database and finally a dashboard made with <:next1:1065672519144714322> **NextJs** and <:tailwind:913088128468787210> **TailwindCSS**.


I’ve seen the opportunity of [making a web dashboard already in __January 2022__](<https://cdn.waya.one/r/1645566813.mp4>), have even started one, but it has never reached a production level as I was never happy with the design and solutions I have come up with, __1 and a half year later,__ I think I’ve done a better job than ever with __https://wamellow.com__ and I’m excited to announce that this is the **public alpha version of Waya v3**. There isn’t a lot of done yet and many things to come, but I think that it will be an amazing product, and with your help we can make it bug free for the release into #bugs.


#  Notes before testing v3
Please note that @wamellow ([Waya v3](<https://wamellow.com>)) is expected to have a ton of bugs until the final release of it, we do not recommend using @wamellow as your primary bot in your server and rather just play and test with it. We'd thank you for reporting any bugs in the <#1135632624019329085> forum.


# Wamellow -> Waya migration
Wamellow will stay online for ever, even after the migration, it will be turned into the nightly (moonly) version of @waya, which means it will get new updates instantly which may have bugs or other issues, just so the bot keeps a purpose <a:RainbowVibeCat:819684581505499166> 


I guess the ETA to the migration to 1-2 months from now on august 2023, there are still quiet a few things left to do
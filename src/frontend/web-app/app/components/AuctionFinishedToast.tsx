import { numberWithCommas } from '@/lib/numberWithComma'
import { Auction, AuctionFinished } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    finishAuction: AuctionFinished
    auction: Auction
}

export default function AuctionFinishedToast({auction, finishAuction}: Props) {
  return (
    <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
        <div className='flex flex-row items-center gap-2'>
            <Image
                src={auction.imageUrl}
                alt='Image of car'
                height={80}
                width={80}
                className='rounded-lg w-auto h-auto'
            />
            <div className='flex flex-col'>
                <span>Auction for {auction.make} {auction.model} has finished</span>
                {finishAuction.itemsSold && finishAuction.amount ? (
                    <p>Congrats to {finishAuction.winner} who as won this auction for 
                        $${numberWithCommas(finishAuction.amount)}</p>
                ) : (
                    <p>This item did not sell</p>
                )}
            </div>
            
        </div>
    </Link>
  )
}

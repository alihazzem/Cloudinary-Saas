import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: {
                price: 'asc'
            }
        })

        // Convert prices from piastres to EGP for frontend display
        const plansWithFormattedPrices = plans.map(plan => ({
            ...plan,
            priceEGP: plan.price / 100, // Convert piastres to EGP
            teamMembersDisplay: plan.teamMembers === -1 ? 'Unlimited' : plan.teamMembers.toString(),
            isUnlimitedTeam: plan.teamMembers === -1
        }))

        return NextResponse.json({
            success: true,
            plans: plansWithFormattedPrices
        })
    } catch (error) {
        console.error('Error fetching plans:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch plans'
            },
            { status: 500 }
        )
    }
}
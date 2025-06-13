import { NextRequest, NextResponse } from 'next/server';
import { analyzeSavingsGoal } from '@/lib/analysis';

export async function POST(request: NextRequest) {
  try {
    const { target, monthlyIncome, icpToUsdRate } = await request.json();

    if (!target || !monthlyIncome) {
      return NextResponse.json(
        { error: 'Target and monthly income are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeSavingsGoal(target, monthlyIncome, icpToUsdRate);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-savings API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze savings goal' },
      { status: 500 }
    );
  }
} 
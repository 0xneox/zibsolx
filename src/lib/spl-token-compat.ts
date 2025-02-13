import BN from 'bn.js';
import { Buffer } from 'buffer';

// Create a u64 compatibility layer
export class u64 extends BN {
  constructor(value: number | string | BN | Buffer) {
    if (value instanceof Buffer) {
      super(value, 'le');
    } else {
      super(value);
    }
  }

  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }

    if (b.length > 8) {
      throw new Error('u64 too large');
    }

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  static fromBuffer(buffer: Buffer): u64 {
    return new u64(buffer);
  }
}

export const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const ASSOCIATED_TOKEN_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

// Export other necessary types and functions that might be used
export type { Mint, Account } from '@solana/spl-token';

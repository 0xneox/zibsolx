import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface ITreasuryManager {
  getWalletAddress(): string;
  getBalance(): Promise<number>;
  getTokenBalance(mint: string): Promise<number>;
}

export class TreasuryManager implements ITreasuryManager {
  private connection: Connection;
  private treasuryWallet: string;

  constructor(rpcUrl: string, treasuryWallet: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.treasuryWallet = treasuryWallet;
  }

  public getWalletAddress(): string {
    return this.treasuryWallet;
  }

  public async getBalance(): Promise<number> {
    const publicKey = new PublicKey(this.treasuryWallet);
    return this.connection.getBalance(publicKey);
  }

  public async getTokenBalance(mint: string): Promise<number> {
    const publicKey = new PublicKey(this.treasuryWallet);
    const tokenMint = new PublicKey(mint);
    const accounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: tokenMint,
      programId: TOKEN_PROGRAM_ID,
    });
    
    if (accounts.value.length === 0) {
      return 0;
    }

    const accountInfo = accounts.value[0].account.data;
    if ('parsed' in accountInfo) {
      return Number(accountInfo.parsed.info.tokenAmount.uiAmount) || 0;
    }

    return 0;
  }
}

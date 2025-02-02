import { Candle } from './candle';
import { TimeFrame, WorkingEnv } from './common';
import { GeneticSchema, TestingPhase } from './genetic';
import { ExecutedOrder, OrderType } from './order';
import { PluginInterface } from './plugin';
import { BaseTransport, Instrument } from './transport';

export interface DebutCore {
    id: string;
    orders: ExecutedOrder[];
    dispose: () => void;
    instrument: Instrument;
    transport: BaseTransport;
    opts: DebutOptions;
    readonly prevCandle: Candle;
    readonly currentCandle: Candle;
    registerPlugins(plugins: PluginInterface[]): void;
    start(): Promise<() => void>;
    getName(): string;
    closeAll(): Promise<ExecutedOrder[]>;
    createOrder(operation: OrderType): Promise<ExecutedOrder>;
    closeOrder(closing: ExecutedOrder): Promise<ExecutedOrder>;
    learn(days: number): Promise<void>;
}

export interface DebutOptions {
    broker: 'tinkoff' | 'binance' | 'alpaca';
    ticker: string;
    currency: string;
    interval: TimeFrame;
    amount: number;
    fee?: number;
    id?: number;
    sandbox?: boolean;
    lotsMultiplier?: number;
    equityLevel?: number;
    // Binance only
    margin?: boolean; // Spot or cross margin
    futures?: boolean; // Cross futures [beta]
    // Enterprise only
    majorCandles?: boolean;
}

export interface DebutMeta {
    parameters: GeneticSchema;
    score: (bot: DebutCore, phase?: TestingPhase) => number;
    validate: (cfg: DebutOptions) => false | DebutOptions;
    stats: (bot: DebutCore) => unknown;
    create: (transport: BaseTransport, cfg: DebutOptions, env: WorkingEnv) => Promise<DebutCore>;
    ticksFilter?: (solution: DebutOptions) => (tick: Candle) => boolean;
    testPlugins?: (cfg: DebutOptions) => PluginInterface[];
    geneticPlugins?: (cfg: DebutOptions) => PluginInterface[];
}

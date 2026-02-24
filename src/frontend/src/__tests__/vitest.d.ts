// Type declarations for vitest when not installed
// This file provides minimal type definitions to allow TypeScript compilation
// Install vitest to use the actual test framework: pnpm add -D vitest @vitest/ui

declare module 'vitest' {
  export interface TestFunction {
    (name: string, fn: () => void | Promise<void>): void;
  }

  export interface DescribeFunction {
    (name: string, fn: () => void): void;
  }

  export interface ExpectStatic {
    (actual: any): Matchers;
  }

  export interface Matchers {
    toBe(expected: any): void;
    toBeUndefined(): void;
    toBeDefined(): void;
    toBeInstanceOf(expected: any): void;
    toHaveProperty(property: string): void;
    toContain(expected: any): void;
    toHaveBeenCalledWith(...args: any[]): void;
    toHaveBeenCalledTimes(times: number): void;
    rejects: {
      toThrow(expected?: string | RegExp): Promise<void>;
    };
    resolves: {
      toBeUndefined(): Promise<void>;
    };
  }

  export interface MockFunction {
    (...args: any[]): any;
    mock: {
      calls: any[][];
    };
  }

  export interface Vi {
    fn(implementation?: (...args: any[]) => any): MockFunction;
    clearAllMocks(): void;
    spyOn(object: any, method: string): MockFunction;
  }

  export const describe: DescribeFunction;
  export const it: TestFunction;
  export const expect: ExpectStatic;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const vi: Vi;
}

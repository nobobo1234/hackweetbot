declare module "chrono-node" {
  namespace ChronoNode {
    interface ParseResult {
      index: number;
      text: string;
      ref: Date;
      start: ParsedComponents;
      end: ParsedComponents | null;
    }

    interface ParsedComponents {
      assign<T>(component: string, value: T): void;
      imply<T>(component: string, value: T): void;
      get<T>(component: string): T;
      isCertain(component: string): boolean;
      date(): Date;
    }

    interface ParseOptions {
      forwardDate: boolean;
      timezones: Record<string, number>;
    }

    interface IParser {
      pattern: () => RegExp;
      extract: (text: string, ref: Date, match: RegExpMatchArray, opt: any) => ParseResult;
    }
    interface ParserConstructor {
      new: () => IParser;
      prototype: IParser;
    }

    interface IChrono {
      parsers: IParser[];
      parse(input: string, ref?: Date, options?: Partial<ParseOptions>): ParseResult[];
      parseDate(input: string, ref?: Date, options?: Partial<ParseOptions>): Date;
    }
    interface ChronoConstructor {
      new: (options?: any) => IChrono;
      prototype: IChrono;
    }

    interface IRefiner {
      refine: (text: string, results: ParseResult, opt: any) => ParseResult;
    }
    interface RefinerConstructor {
      new: () => IRefiner;
      prototype: IRefiner;
    }

    const Parser: ParserConstructor;
    const Chrono: ChronoConstructor;
    const Refiner: RefinerConstructor;

    const parse: IChrono["parse"];
    const parseDate: IChrono["parseDate"];
  }
  export = ChronoNode;
}

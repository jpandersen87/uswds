export type SafeHTML = {
  __html: string;
  toString: () => string;
  info: string;
};

namespace Sanitizer {
  var getEntity: (s: string) => string | undefined;
  var escapeHTML: (...strings: (string | TemplateStringsArray)[]) => string;
  var createSafeHTML: (
    ...strings: (string | TemplateStringsArray)[]
  ) => SafeHTML;
  var unwrapSafeHTML: (...safeHTML: SafeHTML[]) => string;
}

export default Sanitizer;

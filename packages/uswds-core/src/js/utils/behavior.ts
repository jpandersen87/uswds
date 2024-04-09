import assign from "object-assign";
import { behavior } from "receptor";

/**
 * @name sequence
 * @param {...string[]} seq an array of function names
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
const sequence = <S extends string>(...seq: S[]) =>
  function callHooks<
    T extends {
      [P in S]?: <Target extends HTMLElement>(target: Target) => void;
    }
  >(this: T, target = document.body) {
    seq.forEach((method) => {
      if (typeof this[method] === "function") {
        this[method]?.call(this, target);
      }
    });
  };

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
export default <E, P>(events: E, props?: P) =>
  behavior(
    events,
    assign(
      {
        on: sequence("init", "add"),
        off: sequence("teardown", "remove"),
      },
      props
    )
  );

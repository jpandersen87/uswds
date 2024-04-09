import assign from "object-assign";
import Behavior from "receptor/behavior";

/**
 * @name sequence
 * @param {...string[]} seq an array of function names
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module
const sequence = (...seq: string[]) =>
  function callHooks(this: any, target = document.body) {
    seq.forEach((method) => {
      if (typeof this[method] === "function") {
        this[method].call(this, target);
      }
    });
  };

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
export default (events: object, props?: unknown) =>
  Behavior(
    events,
    assign(
      {
        on: sequence("init", "add"),
        off: sequence("teardown", "remove"),
      },
      props
    )
  );
